import PlatformIcon from '@/components/molecules/platform-icon';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { getUserAuth } from '@/lib/auth/utils';
import { db } from '@/lib/db';
import { Platform } from '@batbot/types';
import { AccountCard, AccountCardBody } from './AccountCard';

const UpdateLinkedAccountsCard = async () => {
  const { session } = await getUserAuth();
  const accounts = await db.account.findMany({
    where: {
      userId: session?.user.id
    }
  });

  return (
    <AccountCard
      params={{
        header: 'Linked Accounts',
        description: 'List of accounts linked to your Batbot account.'
      }}
    >
      <AccountCardBody>
        <ToggleGroup
          type="multiple"
          size={'huge'}
          variant="outline"
          value={accounts.map((account) => account.provider)}
        >
          {Object.values(Platform).map((platform) => (
            <ToggleGroupItem key={platform} value={platform}>
              <PlatformIcon platform={platform} />
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </AccountCardBody>
    </AccountCard>
  );
};

export default UpdateLinkedAccountsCard;
