'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { ChatMessage } from '@prisma/client';
import { columns } from './columns';
import { ChatLogsToolbar } from './toolbar';

interface ChatLogsTableProps {
  messages: ChatMessage[];
}

const ChatLogsTable = ({ messages }: ChatLogsTableProps) => {
  return <DataTable columns={columns} data={messages} Toolbar={ChatLogsToolbar} />;
};

export default ChatLogsTable;
