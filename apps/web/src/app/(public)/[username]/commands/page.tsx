import CommandsTable from '@/components/molecules/commands-table';
import PlatformIcon from '@/components/molecules/platform-icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/db';
import { platformLink } from '@/lib/utils/platform';
import { CommandCategory } from '@/types/bot';
import { NON_STREAMING_PLATFORMS, Platform } from '@batbot/types';
import { capitalize } from 'lodash';
import { Metadata, ResolvingMetadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { RxOpenInNewWindow } from 'react-icons/rx';

type Props = {
  params: { username: string };
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const username = params.username;
  const user = await db.user.findFirst({
    where: {
      name: params.username
    },
    select: {
      name: true,
      image: true
    }
  });

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${capitalize(user?.name ?? username)}'s chat commands | BatBot.live`,
    description: `List of commands that are available in ${user?.name ?? username}'s chat.`,
    openGraph: {
      images: previousImages
    }
  };
}

const Cover = () => {
  return (
    <div className="w-full h-64">
      <Image
        src="https://via.assets.so/game.jpg?w=1920&h=1080"
        alt=""
        height={1080}
        width={1920}
        className="w-full h-full object-cover object-center"
      />
    </div>
  );
};

export default async function Commands({ params }: Props) {
  const user = await db.user.findFirst({
    where: {
      name: params.username
    },
    include: {
      BotConfiguration: true,
      BotCommand: {
        where: {
          enabled: true
        }
      },
      accounts: {
        select: {
          provider: true,
          username: true
        }
      }
    }
  });

  if (!user) {
    return redirect('/');
  }

  const channels = user.accounts.reduce(
    (acc, account) => {
      if (
        Object.values(Platform)
          .filter((platform) => !NON_STREAMING_PLATFORMS.includes(platform))
          .includes(account.provider as Platform) &&
        account.username
      ) {
        acc[account.provider as Platform] = account.username;
      }
      return acc;
    },
    {} as Record<Platform, string>
  );

  return (
    <div className="flex flex-col gap-2 overflow-hidden">
      <Cover />
      <div className="flex flex-col items-center -mt-20">
        <Avatar className="w-40 h-40 border-8 border-primary rounded-full">
          <AvatarImage src={user.image ?? ''} alt={user.name ?? ''} className="object-cover object-center" />
          <AvatarFallback className="border-border border-2 text-white">
            {user.name
              ? user.name
                  ?.split(' ')
                  .map((word) => word[0].toUpperCase())
                  .join('')
              : '~'}
          </AvatarFallback>
        </Avatar>
        <div className="flex items-center space-y-2 mt-2 flex-col">
          <h3 className="text-3xl font-semibold capitalize">{user.name}</h3>
          <div className="flex items-center gap-4">
            {Object.entries(channels).map(([platform, username]) => (
              <Link
                href={platformLink(username, platform)}
                key={platform}
                className="flex items-center gap-2"
                target="_blank"
              >
                <PlatformIcon platform={platform as Platform} className="w-6 h-6" withColor />{' '}
                <span className="text-lg">@{username}</span>
                <RxOpenInNewWindow className="w-4 h-4" />
              </Link>
            ))}
          </div>
        </div>

        <div className="container">
          <Card className="w-full mt-8">
            <CardHeader>
              <CardTitle>Available Commands</CardTitle>
              <CardDescription>List of commands that are available in chat.</CardDescription>
            </CardHeader>
            <CardContent>
              <CommandsTable
                commands={user.BotCommand.map((command) => ({
                  ...command,
                  category: CommandCategory.Custom
                }))}
                configuration={user.BotConfiguration?.[0]}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      <section className="space-y-4 mt-8"></section>
    </div>
  );
}
