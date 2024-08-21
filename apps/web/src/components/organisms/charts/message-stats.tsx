'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { format } from 'date-fns';
import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';


interface MessageStatsProps {
  className?: string;
  stats: Array<{
    date: string;
    messages: number;
  }>;
  range: {
    startDate: string;
    endDate: string;
  };
}

const chartConfig = {
  messages: {
    label: 'messages',
    color: 'hsl(var(--chart-1))'
  }
} satisfies ChartConfig;


const MessageStats = ({ className, stats, range }: MessageStatsProps) => {
  const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>('messages');
  const total = useMemo(() => stats.reduce((acc, curr) => acc +  curr.messages , 0), []);

  return (
    <Card className={className}>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Messages</CardTitle>
          <CardDescription>
            Showing messages from the last 3 months ({format(range.startDate, 'MMMM yyyy')} - {format(range.endDate, 'MMMM yyyy')})
          </CardDescription>
        </div>
        <div className="flex">
          <button
            data-active
            className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
          >
            <span className="text-xs text-muted-foreground">Total Chat Messages</span>
            <span className="text-lg font-bold leading-none sm:text-3xl">{total.toLocaleString()}</span>
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6 flex-grow">
        <ChartContainer config={chartConfig} className="aspect-auto w-full h-full">
          <BarChart
            accessibilityLayer
            data={stats}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                return value.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="messages"
                  labelFormatter={(value) =>  "Messages" }
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default MessageStats;
