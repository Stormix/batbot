import CommandsTable from '@/components/molecules/commands-table';
import PageBreadcrumbs from '@/components/molecules/page-breadcrumbs';
import AddCommandDialog from '@/components/organisms/add-command';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { getUserAuth } from '@/lib/auth/utils';
import { db } from '@/lib/db';
import { CommandCategory } from '@/types/bot';
import { builtinCommands } from '@batbot/core';
import Link from 'next/link';
import { RxOpenInNewWindow } from 'react-icons/rx';

export const metadata = {
  title: 'Commands | Batbot',
  description: 'Manage your chatbot commands.'
};

export default async function Commands() {
  const { session } = await getUserAuth();

  const commands = await db.botCommand.findMany({
    where: {
      userId: session!.user.id
    }
  });

  const configuration = await db.botConfiguration.findUnique({
    where: {
      userId: session!.user.id
    }
  });
  return (
    <main className="flex flex-col gap-2">
      <h3 className="text-2xl font-semibold">Bot Commands</h3>
      <PageBreadcrumbs path={['chatbot', 'commands']} />
      <section className="space-y-4 mt-8">
        <Tabs defaultValue="custom">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="system">Built-in Commands</TabsTrigger>
            <TabsTrigger value="custom">Custom Commands</TabsTrigger>
          </TabsList>
          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>Built-in Commands</CardTitle>
                <CardDescription>These are the commands that come with the bot by default.</CardDescription>
              </CardHeader>
              <CardContent>
                <CommandsTable
                  commands={builtinCommands.map((command) => ({
                    ...command,
                    category: CommandCategory.BuiltIn
                  }))}
                  configuration={configuration}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="custom">
            <Card>
              <CardHeader className="flex justify-between flex-row">
                <div className="flex flex-col justify-start items-start gap-2">
                  <CardTitle>Custom Commands</CardTitle>
                  <CardDescription>These are the commands that you have created.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <AddCommandDialog />
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link href={`/${session!.user.name}/commands`} target="_blank" rel="noopener noreferrer">
                        <Button icon={<RxOpenInNewWindow />} variant="secondary" asChild>
                          Commands Portal
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                      Share this with your viewers so they can see the commands you have created.
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardHeader>
              <CardContent>
                <CommandsTable
                  commands={commands.map((command) => ({
                    ...command,
                    category: CommandCategory.Custom
                  }))}
                  configuration={configuration}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
