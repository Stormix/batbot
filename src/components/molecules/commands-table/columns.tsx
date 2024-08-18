'use client';

import { Command } from '@/types/bot';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Code from '@/components/ui/code';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { DataTableColumnHeader } from '@/components/ui/table/column-header';
import { Maybe } from '@/types/generics';
import { Role, RoleLabels } from '@/types/roles';
import { BotConfiguration } from '@prisma/client';

export const columns: (configuration: Maybe<BotConfiguration>) => ColumnDef<Command>[] = (configuration) => [
  {
    accessorKey: 'command',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Command" />,
    cell: ({ row }) => {
      const command = row.original;
      return (
        <Code>
          {configuration?.commandPrefix ?? '!'}
          {command.command}
        </Code>
      );
    }
  },
  {
    accessorKey: 'minRole',
    header: 'User Level',
    cell: ({ row }) => {
      const command = row.original;
      return <span>{RoleLabels[command.minRole as Role]}</span>;
    }
  },
  {
    accessorKey: 'response',
    header: 'Response'
  },
  {
    accessorKey: 'enabled',
    header: 'Enabled'
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-red-400">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];
