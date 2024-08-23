import { db } from '@/lib/db';
import { OAuthConfig, OAuthUserConfig } from 'next-auth/providers/oauth';

interface NightbotProfile {
  status: number;
  authorization: {
    userLevel: string;
    authType: string;
    credentials: {
      expires: string;
      client: string;
    };
    scopes: Array<string>;
  };
  user: {
    _id: string;
    name: string;
    displayName: string;
    provider: string;
    providerId: string;
    avatar: string;
    admin: boolean;
  };
}

export default function NightbotProvider<P extends NightbotProfile>(options: OAuthUserConfig<P>): OAuthConfig<P> {
  return {
    id: 'nightbot',
    name: 'Nightbot',
    type: 'oauth',
    authorization: 'https://api.nightbot.tv/oauth2/authorize?scope=channel+commands',
    token: 'https://api.nightbot.tv/oauth2/token',
    userinfo: 'https://api.nightbot.tv/1/me',
    async profile(profile) {
      const { provider, providerId } = profile.user;
      const account = await db.account.findFirst({
        where: {
          provider: provider,
          providerAccountId: providerId
        },
        include: { user: true }
      });
      if (!account) throw new Error('Account not found');
      return {
        id: profile.user._id,
        name: profile.user.name,
        email: account.user.email
      };
    },
    style: { logo: '/nightbot.svg', bg: '#5865F2', text: '#fff' },
    options
  };
}
