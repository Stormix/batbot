'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { AccountCard, AccountCardBody, AccountCardFooter } from './AccountCard';

export default function UpdateEmailCard({ email }: { email: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const target = event.target as HTMLFormElement;
    const form = new FormData(target);
    const { email } = Object.fromEntries(form.entries()) as { email: string };
    if (email.length < 3) {
      toast.error('Email must be longer than 3 characters.');
      return;
    }

    startTransition(async () => {
      const res = await fetch('/api/account', {
        method: 'PUT',
        body: JSON.stringify({ email }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (res.status === 200) toast.success('Successfully updated email!');
      router.refresh();
    });
  };

  return (
    <AccountCard
      params={{
        header: 'Email',
        description: 'Please enter the email address you want to use with your account.'
      }}
    >
      <form onSubmit={handleSubmit}>
        <AccountCardBody>
          <Input defaultValue={email ?? ''} name="email" disabled={true} />
        </AccountCardBody>
        <AccountCardFooter description="We will email vou to verify the change.">
          <Button disabled={true}>Update Email</Button>
        </AccountCardFooter>
      </form>
    </AccountCard>
  );
}
