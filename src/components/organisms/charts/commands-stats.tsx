'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';

const chartData = [
  { command: '!about', messages: 186 },
  { command: '!kick', messages: 214 },
  { command: '!mic', messages: 214 },
  { command: '!specs', messages: 514 }
];

const chartConfig = {
  messages: {
    label: 'Messages',
    color: 'hsl(var(--chart-1))'
  }
} satisfies ChartConfig;

const CommandsStats = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Popular commands</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData} layout="vertical">
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="command"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="messages" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Bar dataKey="messages" layout="vertical" fill="var(--color-messages)" radius={4}>
              <LabelList
                dataKey="command"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList dataKey="messages" position="right" offset={8} className="fill-foreground" fontSize={12} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default CommandsStats;
