'use client';

import { importCommands } from '@/app/(app)/import/action';
import { ImportSchema, importSchema } from '@/app/(app)/import/schemas';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import useServerAction from '@/hooks/useServerAction';
import { ImportProvider, providerName } from '@/lib/import/constants';
import { CommandCategory } from '@/types/bot';
import { Maybe } from '@/types/generics';
import { zodResolver } from '@hookform/resolvers/zod';
import { BotCommand, BotConfiguration } from '@prisma/client';
import { signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { CiWarning } from 'react-icons/ci';
import { LuSave } from 'react-icons/lu';
import { RxDownload } from 'react-icons/rx';
import { toast } from 'sonner';
import CommandsTable from '../molecules/commands-table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface ImportCardProps {
  provider: ImportProvider;
  configuration: Maybe<BotConfiguration>;
  commands: BotCommand[];
  providerAccount?: {
    id: string;
    username: string | null;
  };
  requireAccount?: boolean;
}

const ProviderIcon = ({ provider }: { provider: ImportProvider }) => {
  switch (provider) {
    case ImportProvider.StreamElements:
      return '';
    case ImportProvider.NightBot:
      return '';
    case ImportProvider.Botrix:
      return '';
  }
};

const ConnectProviderAccountAlert = ({ provider }: { provider: ImportProvider }) => {
  return (
    <Alert variant="destructive">
      <CiWarning className="h-12 w-12" />
      <div className="flex flex-col w-full">
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          <p>You need to connect your {providerName[provider]} account to import your commands.</p>
        </AlertDescription>
      </div>
      <Button variant="destructive" onClick={() => signIn(provider)}>
        Connect {providerName[provider]} account
      </Button>
    </Alert>
  );
};

const DuplicateCommandsAlert = ({ commands, configuration }: ImportCardProps) => {
  return (
    <Alert variant="info">
      <CiWarning className="h-12 w-12" />
      <div className="flex flex-col">
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          <p>Some of the commands you are trying to import already exist on babot. These commands will be skipped: </p>
          <div className="gap-1 flex flex-wrap">
            {commands.map((command) => (
              <span key={command.id} className="font-semibold">
                {configuration?.commandPrefix ?? '!'}
                {command.command}
              </span>
            ))}
          </div>
        </AlertDescription>
      </div>
    </Alert>
  );
};

const ImportCard = ({ provider, configuration, commands, requireAccount, providerAccount }: ImportCardProps) => {
  const [importedCommands, setImportedCommands] = useState<BotCommand[]>([]);
  const hasImported = importedCommands.length > 0;
  const duplicateCommands = commands.filter((command) => importedCommands.some((c) => c.command === command.command));

  const form = useForm<ImportSchema>({
    resolver: zodResolver(importSchema),
    defaultValues: {
      username: requireAccount ? (providerAccount?.username ?? '') : '',
      provider,
      save: hasImported
    }
  });

  const { isPending, onSubmit } = useServerAction(form, importCommands, {
    onSuccess: ({ commands, error }) => {
      if (error) {
        return toast.error(
          "We couldn't import your commands. Please make sure you entered the correct username and try again."
        );
      }
      if (hasImported) {
        toast.success('Commands saved');
        return;
      }
      toast.success(`${commands?.length ?? 0} commands imported`);
      setImportedCommands(commands ?? []);
    },
    onError: (error) => {
      toast.error(error);
    }
  });

  useEffect(() => {
    form.setValue('save', hasImported);
  }, [hasImported]);

  return (
    <Form {...form}>
      <Card>
        <CardHeader>
          <ProviderIcon provider={provider} />
          <CardTitle>{providerName[provider]} Import</CardTitle>
          <CardDescription>
            Import your {providerName[provider]} settings and commands to Batbot to get started.
          </CardDescription>
          {requireAccount && !providerAccount && <ConnectProviderAccountAlert provider={provider} />}
          {duplicateCommands?.length > 0 && (
            <DuplicateCommandsAlert commands={duplicateCommands} configuration={configuration} provider={provider} />
          )}
        </CardHeader>
        <CardContent>
          {hasImported ? (
            <CommandsTable
              commands={importedCommands.map((command) => ({
                ...command,
                category: CommandCategory.Custom
              }))}
              configuration={configuration}
              noToolbar
            />
          ) : (
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} readOnly={requireAccount && providerAccount?.username !== null} />
                  </FormControl>
                  <FormDescription>
                    {!requireAccount && (
                      <p>
                        Enter your {providerName[provider]} username to import your settings and commands. You can also
                        use someone elses username to import their commands.
                      </p>
                    )}
                    {requireAccount && (
                      <p>
                        Your {providerName[provider]} account is {providerAccount ? 'connected' : 'not connected'}. You
                        can only import your own commands.
                      </p>
                    )}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </CardContent>
        <CardFooter className="justify-end">
          <Button icon={hasImported ? <LuSave /> : <RxDownload />} onClick={onSubmit} loading={isPending}>
            {hasImported ? 'Save commands' : 'Import'}
          </Button>
        </CardFooter>
      </Card>
    </Form>
  );
};

export default ImportCard;
