'use client';

import { additionalLinks, defaultLinks } from '@/config/navigation';
import { cn } from '@/lib/utils/styles';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconType } from 'react-icons/lib';

export interface SidebarLink {
  title: string;
  href: string;
  icon: LucideIcon | IconType;
}

const SidebarItems = () => {
  return <SidebarLinkGroup links={defaultLinks} />;
};

export default SidebarItems;

const AdditionalSidebarItems = () => {
  if (additionalLinks.length === 0) return null;
  return (
    <>
      {additionalLinks.map((l) => (
        <SidebarLinkGroup links={l.links} title={l.title} border key={l.title} />
      ))}
    </>
  );
};

export { AdditionalSidebarItems, SidebarItems };

const SidebarLinkGroup = ({ links, title, border }: { links: SidebarLink[]; title?: string; border?: boolean }) => {
  const fullPathname = usePathname();
  const pathname = '/' + fullPathname.split('/')[1];

  return (
    <div
      className={cn({
        'border-border border-t my-16 pt-3': border
      })}
    >
      <ul>
        {links.map((link) => (
          <li key={link.title}>
            <SidebarLink link={link} active={pathname === link.href} />
          </li>
        ))}
      </ul>
    </div>
  );
};

const SidebarLink = ({ link, active }: { link: SidebarLink; active: boolean }) => {
  return (
    <Link
      href={link.href}
      className={cn(
        'group transition-colors p-2 inline-block hover:bg-popover hover:text-primary text-muted-foreground hover:shadow rounded-md w-full',
        {
          'text-primary font-semibold': active
        }
      )}
    >
      <div className="flex items-center gap-2">
        <div
          className={cn('opacity-0 left-0 h-6 w-[4px] absolute rounded-r-lg bg-primary', { 'opacity-100': active })}
        />
        <link.icon className="h-5" />
        <span>{link.title}</span>
      </div>
    </Link>
  );
};
