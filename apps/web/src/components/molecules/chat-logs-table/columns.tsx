'use client';

import { DataTableColumnHeader } from '@/components/ui/table/column-header';
import { platformLink } from '@/lib/utils/platform';
import { Platform } from '@batbot/types';
import { ChatMessage } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import { RxOpenInNewWindow } from 'react-icons/rx';
import PlatformIcon from '../platform-icon';

export const columns: ColumnDef<ChatMessage>[] = [
  {
    accessorKey: 'timestamp',
    size: 200,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => {
      const message = row.original;
      return <span>{new Date(message.timestamp).toLocaleString()}</span>;
    }
  },
  {
    accessorKey: 'username',
    size: 200,
    header: ({ column }) => <DataTableColumnHeader column={column} title="Username" />,
    cell: ({ row }) => {
      return (
        <Link
          className="font-semibold flex items-center gap-1 group"
          href={platformLink(row.original.username, row.original.platform as Platform)}
          target="_blank"
        >
          {row.original.username}
          <RxOpenInNewWindow className="w-4 h-4 text-transparent group-hover:text-white transition-colors duration-200" />
        </Link>
      );
    }
  },
  {
    accessorKey: 'message',
    header: 'Message',
    cell: ({ row }) => {
      return <p className="font-mono">{row.original.message}</p>;
    }
  },
  {
    size: 100,
    accessorKey: 'platform',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Platform" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2 capitalize">
          <PlatformIcon platform={row.original.platform as Platform} className="w-4 h-4" />
          {row.original.platform}
        </div>
      );
    }
  }
];
