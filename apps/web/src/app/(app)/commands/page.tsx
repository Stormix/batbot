import CommandsTable from '@/components/molecules/commands-table';
import PageBreadcrumbs from '@/components/molecules/page-breadcrumbs';
import AddCommandDialog from '@/components/organisms/add-command';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUserAuth } from '@/lib/auth/utils';
import { db } from '@/lib/db';
import { CommandCategory } from '@/types/bot';
import { builtinCommands } from '@batbot/core';

export default async function Home() {
  const { session } = await getUserAuth();

  const commands = await db.botCommand.findMany({
    where: {
      userId: session!.user.id
    },
    take: 100
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
                <AddCommandDialog />
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
