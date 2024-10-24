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
  noActions?: boolean;
}

const CommandsTable = ({ commands, configuration, noToolbar = false, noActions = true }: CommandsTableProps) => {
  return (
    <DataTable
      columns={columns(configuration, {
        noActions
      })}
      data={commands}
      Toolbar={noToolbar ? undefined : CommandsToolbar}
    />
  );
};

export default CommandsTable;
