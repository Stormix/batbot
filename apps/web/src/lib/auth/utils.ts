import { db } from '@/lib/db/index';
import { env } from '@/lib/env.mjs';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { DefaultSession, getServerSession, NextAuthOptions } from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import DiscordProvider from 'next-auth/providers/discord';
import TwitchProvider from 'next-auth/providers/twitch';
import { redirect } from 'next/navigation';
import NightbotProvider from './Nightbot';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string;
    };
  }
}

export type AuthSession = {
  session: {
    user: {
      id: string;
      name?: string;
      email?: string;
    };
  } | null;
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  callbacks: {
    session: ({ session, user }) => {
      session.user.id = user.id;
      return session;
    }
  },
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true
    }),
    TwitchProvider({
      clientId: env.TWITCH_CLIENT_ID,
      clientSecret: env.TWITCH_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true
    }),
    NightbotProvider({
      clientId: env.NIGHTBOT_CLIENT_ID,
      clientSecret: env.NIGHTBOT_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true
    })
  ],
  pages: {
    signIn: '/signin'
  },
  events: {
    async linkAccount({ user, account, profile }) {
      if (profile.name) {
        // Store the linked account username in the database
        await db.account.update({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId
            }
          },
          data: {
            username: profile.name
          }
        });
      }
    }
  }
};

export const getUserAuth = async () => {
  const session = await getServerSession(authOptions);
  return { session } as AuthSession;
};

export const checkAuth = async () => {
  const { session } = await getUserAuth();
  if (!session) redirect('/signin');
};
