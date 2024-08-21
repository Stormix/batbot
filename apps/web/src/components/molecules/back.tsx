'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

const BackButton = () => {
  const router = useRouter();
  const goBack = () => {
    // if there's a previous page, go back to it
    if (window.history.length > 1) {
      window.history.back();
    }

    // otherwise, go to the homepage
    router.push('/');
  };

  return (
    <Link href="#" onClick={goBack} className="flex items-center text-sm gap-2">
      <span aria-hidden="true">&larr;</span> <span>Back</span>
    </Link>
  );
};

export default BackButton;
