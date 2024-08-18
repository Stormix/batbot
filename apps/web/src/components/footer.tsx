const Footer = () => {
  return (
    <footer className="flex justify-center py-4 px-8 w-full text-muted-foreground">
      <p className="text-center text-sm leading-5">
        © <b>2024</b> BatBot, a project by{' '}
        <a href="https://www.twitch.tv/stormix_dev" target="_blank" rel="noopener noreferrer" className="text-primary">
          Stormix
        </a>
        . All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
