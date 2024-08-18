import { AuthSession, getUserAuth } from '@/lib/auth/utils';
import { LogOutIcon } from 'lucide-react';
import Link from 'next/link';
import Logo from './logo';
import SidebarItems, { AdditionalSidebarItems } from './SidebarItems';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';

const Sidebar = async () => {
  const session = await getUserAuth();
  if (session.session === null) return null;

  return (
    <aside className="h-screen min-w-64 bg-background hidden md:block p-4 pt-8 border-r border-border shadow-inner">
      <div className="flex flex-col justify-between h-full">
        <div className="space-y-4">
          <div className="flex items-center gap-4 px-4">
            <Logo variant="default" className="h-10 w-10" />
            <span className="text-2xl font-logo uppercase">BatBot</span>
          </div>
          <Separator className="w-8 mx-auto" />
          <SidebarItems />
        </div>
        <div className="flex flex-col pt-2">
          <AdditionalSidebarItems />
          <UserCard session={session} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

const UserCard = ({ session }: { session: AuthSession }) => {
  if (session.session === null) return null;
  const { user } = session.session;
  if (!user?.name || user.name.length == 0) return null;
  return (
    <Link href="/account">
      <div className="flex items-center justify-between w-full border-t border-border py-2 px-2 bg-primary rounded-lg text-black">
        <div className="flex items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="border-border border-2 text-white">
              {user.name
                ? user.name
                    ?.split(' ')
                    .map((word) => word[0].toUpperCase())
                    .join('')
                : '~'}
            </AvatarFallback>
          </Avatar>
          <div className="capitalize">{user.name ?? 'John Doe'}</div>
        </div>
        <div className="rounded-full p-2">
          <LogOutIcon className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
};
