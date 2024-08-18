'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';

const chartData = [
  { browser: 'kick', visitors: 275, fill: 'var(--color-kick)' },
  { browser: 'twitch', visitors: 200, fill: 'var(--color-twitch)' },
  { browser: 'youtube', visitors: 187, fill: 'var(--color-youtube)' }
];

const chartConfig = {
  visitors: {
    label: 'Visitors'
  },
  kick: {
    label: 'Kick',
    color: 'rgba(83,252,24,1)'
  },
  twitch: {
    label: 'Twitch',
    color: '#9146ff'
  },
  youtube: {
    label: 'Youtube',
    color: '#ff0000'
  }
} satisfies ChartConfig;

const PlatformStats = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Stats</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0
            }}
          >
            <YAxis
              dataKey="browser"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label}
            />
            <XAxis dataKey="visitors" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="visitors" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PlatformStats;
