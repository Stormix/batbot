'use client';

import { upsert } from '@/app/(app)/chatbot/action';
import { Configuration, configurationSchema } from '@/app/(app)/chatbot/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import useServerAction from '@/hooks/useServerAction';
import { Platform } from '@/types/bot';
import { Maybe } from '@/types/generics';
import { zodResolver } from '@hookform/resolvers/zod';
import { BotConfiguration } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { LuSave } from 'react-icons/lu';
import { RxReload } from 'react-icons/rx';
import { toast } from 'sonner';
import PlatformIcon from '../molecules/platform-icon';
import Code from '../ui/code';
import { Input } from '../ui/input';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';

const BotConfigurationForm = ({ initialValues }: { initialValues: Maybe<BotConfiguration> }) => {
  const form = useForm<Configuration>({
    resolver: zodResolver(configurationSchema),
    defaultValues: initialValues
      ? {
          ...initialValues,
          enabledPlatforms: JSON.parse(initialValues.enabledPlatforms)
        }
      : {
          enabled: false,
          commandPrefix: '!',
          enabledPlatforms: []
        }
  });

  const { isPending, onSubmit } = useServerAction(form, upsert, {
    onSuccess: () => {
      toast.success('Bot configuration saved successfully');
    },
    onError: (error) => {
      toast.error(error);
    }
  });

  const prefix = form.watch('commandPrefix');
  return (
    <Form {...form}>
      <form className="space-y-8">
        <Card>
          <CardHeader>
            <CardDescription>Configure the settings for the chatbot.</CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4 flex-col">
            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <div className="flex items-center justify-between">
                    <FormLabel>Enable ChatBot</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </div>
                  <FormDescription>
                    Make sure to <Code>/mod batbot</Code> on your channel beforehand.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="commandPrefix"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Command prefix</FormLabel>
                  <FormControl>
                    <Input placeholder="!" {...field} />
                  </FormControl>
                  <FormDescription>
                    For example: <Code>{prefix}game</Code>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="enabledPlatforms"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Enabled platforms</FormLabel>
                  <FormDescription>Select the platforms where the chatbot will be enabled</FormDescription>
                  <FormControl>
                    <ToggleGroup
                      type="multiple"
                      size={'huge'}
                      variant="outline"
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      {Object.values(Platform).map((platform) => (
                        <ToggleGroupItem key={platform} value={platform}>
                          <PlatformIcon platform={platform} />
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end border-t pt-4 gap-4">
            <Button type="submit" onClick={onSubmit} loading={isPending} icon={<LuSave />}>
              Save Configuration
            </Button>
            <Button type="reset" variant="secondary" icon={<RxReload />}>
              Reset
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default BotConfigurationForm;
