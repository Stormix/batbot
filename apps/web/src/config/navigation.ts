import { SidebarLink } from '@/components/SidebarItems';
import { BookIcon, BotIcon, GaugeIcon, HelpCircleIcon, ImportIcon, NotebookIcon, User, WandIcon } from 'lucide-react';

type AdditionalLinks = {
  title: string;
  links: SidebarLink[];
  badge?: string;
};

export const defaultLinks: SidebarLink[] = [
  { href: '/dashboard', title: 'Dashboard', icon: GaugeIcon },
  { href: '/chatbot', title: 'Chat Bot', icon: BotIcon },
  { href: '/commands', title: 'Commands', icon: WandIcon },
  { href: '/logs', title: 'Logs', icon: NotebookIcon },
  { href: '/account', title: 'Account', icon: User },
  { href: '/import', title: 'Import', icon: ImportIcon, badge: 'New' }
];

export const additionalLinks: AdditionalLinks[] = [
  {
    title: 'Support',
    links: [
      { href: 'https://docs.batbot.live', title: 'Help Docs', icon: BookIcon },
      { href: 'https://discord.gg/BByMsHV3W4', title: 'Support', icon: HelpCircleIcon }
    ]
  }
];
