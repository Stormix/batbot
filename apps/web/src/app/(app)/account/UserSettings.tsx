import { AuthSession } from '@/lib/auth/utils';

import UpdateEmailCard from './UpdateEmailCard';
import UpdateLinkedAccountsCard from './UpdateLinkedAccountsCard';
import UpdateNameCard from './UpdateNameCard';

export default function UserSettings({ session }: { session: AuthSession['session'] }) {
  return (
    <>
      <UpdateLinkedAccountsCard />
      <UpdateNameCard name={session?.user.name ?? ''} />
      <UpdateEmailCard email={session?.user.email ?? ''} />
    </>
  );
}
