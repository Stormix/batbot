import { cn } from '@/lib/utils';
import { Platform } from '@/types/bot';
import { BiLogoYoutube } from 'react-icons/bi';
import { SiDiscord, SiKick, SiTwitch } from 'react-icons/si';

const PlatformIcon = ({ platform, className }: { platform: Platform; className?: string }) => {
  switch (platform) {
    case Platform.Discord:
      return <SiDiscord className={cn('w-6 h-6', className)} />;
    case Platform.Twitch:
      return <SiTwitch className={cn('w-6 h-6', className)} />;
    case Platform.Kick:
      return <SiKick className={cn('w-6 h-6', className)} />;
    case Platform.Youtube:
      return <BiLogoYoutube className={cn('w-6 h-6', className)} />;
    default:
      return null;
  }
};

export default PlatformIcon;
