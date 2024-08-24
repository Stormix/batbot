import { Platform } from '@batbot/types';

export const platformLink = (username: string, platform: Platform | string) => {
  switch (platform) {
    case Platform.Twitch:
      return `https://twitch.tv/${username}`;
    case Platform.Kick:
      return `https://kick.com/${username}`;
  }
  return '#';
};
