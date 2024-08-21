'use client';

import { cn } from '@/lib/utils/styles';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { LuTwitch } from 'react-icons/lu';
import { RxDiscordLogo } from 'react-icons/rx';
import { Button } from '../ui/button';

const ProviderIcon = ({ provider, className }: { provider: 'discord' | 'twitch'; className?: string }) => {
  switch (provider) {
    case 'discord':
      return <RxDiscordLogo className={className} />;
    case 'twitch':
      return <LuTwitch className={className} />;
    default:
      return null;
  }
};

const AuthForm = () => {
  return (
    <div className="flex gap-4 flex-col items-center">
      <h3 className="font-bold text-2xl">Sign in to your account</h3>
      {(['discord', 'twitch'] as const).map((provider) => (
        <div key={provider} className="w-full">
          <Button
            className={cn('w-full hover:text-white transition-all ease-in-out duration-350', {
              'hover:bg-discord': provider === 'discord',
              'hover:bg-twitch': provider === 'twitch'
            })}
            variant="outline"
            type="button"
            size="lg"
            icon={<ProviderIcon provider={provider} className="h-4 w-4 text-foreground" />}
            onClick={() => signIn(provider)}
          >
            Sign in with {provider}
          </Button>
        </div>
      ))}
      <p className="text-muted-foreground text-sm">
        By signing in, you agree to our{' '}
        <Link href="#" className="underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="#" className="underline">
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
};

export default AuthForm;
