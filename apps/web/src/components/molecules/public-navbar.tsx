import Link from 'next/link';
import Logo from '../logo';
import { Button } from '../ui/button';

const PublicNavbar = () => {
  return (
    <div className="flex items-center justify-between bg-background px-8 py-4 border-border border-b">
      <div className="flex items-center space-x-4">
        <Logo className="w-8 h-8" />
        <Logo variant="text" className="h-3" />
      </div>
      <Button asChild icon={<Logo className="w-4 h-4" />} variant={'khnouni'}>
        <Link href="/login">
          Add <b>Batbot</b> to your stream!
        </Link>
      </Button>
    </div>
  );
};

export default PublicNavbar;
