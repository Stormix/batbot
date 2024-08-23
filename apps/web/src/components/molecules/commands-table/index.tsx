'use client';

import { CommandsToolbar } from '@/components/organisms/commands-toolbar';
import { DataTable } from '@/components/ui/table/data-table';
import { Command } from '@/types/bot';
import { Maybe } from '@/types/generics';
import { BotConfiguration } from '@prisma/client';
import { columns } from './columns';

interface CommandsTableProps {
  commands: Command[];
  configuration: Maybe<BotConfiguration>;
  noToolbar?: boolean;
}

const CommandsTable = ({ commands, configuration, noToolbar = false }: CommandsTableProps) => {
  return (
    <DataTable columns={columns(configuration)} data={commands} Toolbar={noToolbar ? undefined : CommandsToolbar} />
  );
};

export default CommandsTable;
