import { DataTable } from '@/components/ui/table/data-table';
import { Command } from '@/types/bot';
import { columns } from './columns';

interface CommandsTableProps {
  commands: Command[];
}

const CommandsTable = ({ commands }: CommandsTableProps) => {
  return <DataTable columns={columns} data={commands} />;
};

export default CommandsTable;
