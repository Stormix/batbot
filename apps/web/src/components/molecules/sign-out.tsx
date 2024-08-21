'use client';

import { LogOutIcon } from 'lucide-react';
import { signOut } from 'next-auth/react';

const SignOutBtn = () => {
  return (
    <div className="rounded-full p-2" onClick={() => signOut()}>
      <LogOutIcon className="h-4 w-4" />
    </div>
  );
};

export default SignOutBtn;
