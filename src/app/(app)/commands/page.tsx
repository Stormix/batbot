import CommandsTable from '@/components/molecules/commands-table';
import PageBreadcrumbs from '@/components/molecules/page-breadcrumbs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUserAuth } from '@/lib/auth/utils';

export default async function Home() {
  const { session } = await getUserAuth();
  return (
    <main className="flex flex-col gap-2">
      <h3 className="text-2xl font-semibold">Bot Commands</h3>
      <PageBreadcrumbs path={['commands']} />

      <section className="space-y-4 mt-8">
        <Tabs defaultValue="system">
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
                <CommandsTable commands={[]} />
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-4 gap-4">
                <Button type="submit">Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="custom">
            <Card>
              <CardHeader>
                <CardTitle>Custom Commands</CardTitle>
                <CardDescription>These are the commands that you have created.</CardDescription>
              </CardHeader>
              <CardContent>
                <CommandsTable commands={[]} />
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-4 gap-4">
                <Button type="submit">Save changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
