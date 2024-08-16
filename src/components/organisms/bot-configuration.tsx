'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Platform } from '@/types/bot';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import PlatformIcon from '../molecules/platform-icon';
import Code from '../ui/code';
import { Input } from '../ui/input';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';

const configurationSchema = z.object({
  enabled: z.boolean().default(false),
  commandPrefix: z.string().default('!'),
  enabledPlatforms: z.array(z.string()).default([])
});
type Configuration = z.infer<typeof configurationSchema>;

const BotConfiguration = () => {
  const form = useForm<Configuration>({
    resolver: zodResolver(configurationSchema),
    defaultValues: {
      enabled: false,
      commandPrefix: '!',
      enabledPlatforms: []
    }
  });

  const onSubmit = (values: Configuration) => {
    // Save the configuration
    console.log(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                    For example: <Code>!game</Code>
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
                    <ToggleGroup type="multiple" size={'huge'} variant="outline" onValueChange={field.onChange}>
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
            <Button type="submit">Save</Button>
            <Button type="reset" variant="secondary">
              Reset
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default BotConfiguration;
