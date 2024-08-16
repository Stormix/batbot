import { SidebarLink } from '@/components/SidebarItems';
import { BotIcon, Cog, GaugeIcon, User, WandIcon } from 'lucide-react';

type AdditionalLinks = {
  title: string;
  links: SidebarLink[];
};

export const defaultLinks: SidebarLink[] = [
  { href: '/dashboard', title: 'Dashboard', icon: GaugeIcon },
  { href: '/chatbot', title: 'Chat Bot', icon: BotIcon },
  { href: '/commands', title: 'Commands', icon: WandIcon },
  { href: '/account', title: 'Account', icon: User },
  { href: '/settings', title: 'Settings', icon: Cog }
];

export const additionalLinks: AdditionalLinks[] = [];
