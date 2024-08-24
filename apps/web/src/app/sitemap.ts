import { db } from '@/lib/db';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const users = await db.user.findMany({
    select: {
      name: true
    }
  });

  return [
    {
      url: 'https://batbot.live',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1
    },
    ...users.map((user) => ({
      url: `https://batbot.live/${user.name}/commands`,
      lastModified: new Date(),
      changeFrequency: 'hourly' as const,
      priority: 0.8
    }))
  ];
}
