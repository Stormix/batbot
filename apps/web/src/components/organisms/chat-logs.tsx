import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChatMessage } from '@prisma/client';
import ChatLogsTable from '../molecules/chat-logs-table';

const ChatLogs = ({ messages }: { messages: ChatMessage[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat logs</CardTitle>
        <CardDescription>Chat messages send by users accross all channels</CardDescription>
      </CardHeader>
      <CardContent>
        <ChatLogsTable messages={messages} />
      </CardContent>
    </Card>
  );
};

export default ChatLogs;
