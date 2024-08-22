'use client';

import { create } from '@/app/(app)/commands/action';
import { NewCommand, newCommandSchema } from '@/app/(app)/commands/schemas';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import useServerAction from '@/hooks/useServerAction';
import { Role, RoleLabels } from '@batbot/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { RxCross1, RxPlus } from 'react-icons/rx';
import { toast } from 'sonner';
import Code from '../ui/code';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Textarea } from '../ui/textarea';

const AddCommandDialog = () => {
  const [open, setOpen] = useState(false);

  const form = useForm<NewCommand>({
    resolver: zodResolver(newCommandSchema),
    defaultValues: {
      command: 'aaa',
      response: 'bbb',
      cooldown: 5,
      aliases: ['dd'],
      minRole: Role.User,
      enabled: true
    }
  });

  const command = form.watch('command');
  const cooldown = form.watch('cooldown');
  const aliases = form.watch('aliases');

  const { isPending, onSubmit } = useServerAction(form, create, {
    onSuccess: () => {
      toast('Command has been created.');
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error);
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-8">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button icon={<RxPlus />}>Add custom command</Button>
          </DialogTrigger>
          <DialogContent className="">
            <DialogHeader>
              <DialogTitle>New Custom Command</DialogTitle>
              <DialogDescription>New custom commands are active immediately after saving.</DialogDescription>
            </DialogHeader>

            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <div className="flex items-center justify-between">
                    <FormLabel>Enabled</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="command"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Command</FormLabel>
                  <FormControl>
                    <Input placeholder="kick" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your command name. You can set the value to anything you want, prefix will be added
                    automatically. E.g: <Code>!{command}</Code>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="response"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Response</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Follow me on kick: https://kick.com/you"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your command response. You can use command variables documented <a href="#">here</a> to make
                    dynamic responses.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cooldown"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cooldown ({cooldown}s)</FormLabel>
                  <FormControl>
                    <Slider
                      min={5}
                      max={300}
                      step={1}
                      value={[Number(field.value)]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                  <FormDescription>
                    This is the minimum amount of time that must pass before a user can use the command again.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="aliases"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Command aliases</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="kickchannel, stream ..etc"
                      value={field.value.join(',')}
                      onChange={(e) => field.onChange(e.target.value.split(','))}
                    />
                  </FormControl>
                  <FormDescription>
                    These are the aliases that can be used to trigger the command. Separate aliases by a comma.
                    {command && aliases.length > 0 && (
                      <>
                        <br />
                        Typing:{' '}
                        {aliases.map((alias) => (
                          <Code key={alias}>!{alias}</Code>
                        ))}{' '}
                        will trigger the command <Code>!{command}</Code>.
                      </>
                    )}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="minRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a verified email to display" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(Role)
                        .filter((role) => !isNaN(Number(role)))
                        .map((role) => (
                          <SelectItem key={role} value={role.toString()}>
                            {RoleLabels[role as Role]}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>Select the minimum role required to use this command.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button icon={<RxPlus />} loading={isPending} onClick={onSubmit}>
                Save
              </Button>
              <DialogClose asChild>
                <Button icon={<RxCross1 />} type="reset" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </Form>
  );
};

export default AddCommandDialog;
