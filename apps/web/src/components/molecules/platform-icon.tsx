import { cn } from '@/lib/utils/styles';
import { Platform } from '@batbot/types';
import { BiLogoYoutube } from 'react-icons/bi';
import { SiDiscord, SiKick, SiTwitch } from 'react-icons/si';

const PlatformIcon = ({
  platform,
  className,
  withColor
}: {
  platform: Platform;
  className?: string;
  withColor?: boolean;
}) => {
  switch (platform) {
    case Platform.Discord:
      return (
        <SiDiscord
          className={cn('w-6 h-6', className, {
            'text-discord': withColor
          })}
        />
      );
    case Platform.Twitch:
      return (
        <SiTwitch
          className={cn('w-6 h-6', className, {
            'text-twitch': withColor
          })}
        />
      );
    case Platform.Kick:
      return (
        <SiKick
          className={cn('w-6 h-6', className, {
            'text-kick': withColor
          })}
        />
      );
    case Platform.Youtube:
      return (
        <BiLogoYoutube
          className={cn('w-6 h-6', className, {
            'text-youtube': withColor
          })}
        />
      );
    default:
      return null;
  }
};

export default PlatformIcon;
