import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="flex py-4 w-full text-muted-foreground border-t items-center justify-between">
      <p className="text-center text-sm leading-5">
        © <b>2024</b> BatBot, a project by{' '}
        <a href="https://www.twitch.tv/stormix_dev" target="_blank" rel="noopener noreferrer" className="text-primary">
          Stormix
        </a>
        . All rights reserved.
      </p>

      <div className="flex items-center gap-2">
        <Link href="https://docs.batbot.live" className="text-primary">
          Docs
        </Link>
        <span>·</span>
        <Link href="https://github.com/stormix" className="text-primary">
          Github
        </Link>
        <span>·</span>
        <Link href="https://discord.gg/BByMsHV3W4" className="text-primary">
          Discord
        </Link>
        <span>·</span>
        <Link href="#" className="text-primary">
          Terms of Service
        </Link>
        <span>·</span>
        <Link href="#" className="text-primary">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
