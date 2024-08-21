'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Platform } from '@batbot/types';
import { format } from 'date-fns';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';

interface PlatformStat {
  platform: Platform;
  messages: number;
}
interface PlatformStatsProps {
  stats: PlatformStat[];
  range: {
    startDate: Date;
    endDate: Date;
  };
}

const chartConfig = {
  [Platform.Kick]: {
    label: 'Kick',
    color: 'rgba(83,252,24,1)'
  },
  [Platform.Twitch]: {
    label: 'Twitch',
    color: '#9146ff'
  },
  [Platform.Youtube]: {
    label: 'Youtube',
    color: '#ff0000'
  }
} as Record<Platform, { label: string; color: string }>;

const PlatformStats = ({ stats, range }: PlatformStatsProps) => {
  const chartData = stats
    .map((stat) => ({
      ...stat,
      fill: chartConfig[stat.platform]?.color
    }))
    .sort((a, b) => b.messages - a.messages);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Stats</CardTitle>
        <CardDescription>
          {format(range.startDate, 'MMMM yyyy')} - {format(range.endDate, 'MMMM yyyy')}
        </CardDescription>
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
              dataKey="platform"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label}
            />
            <XAxis dataKey="messages" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="messages" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PlatformStats;
