# BatBot

BatBot is a comprehensive chatbot solution for live streaming platforms, including Kick, Twitch, and YouTube. It offers moderation and entertainment features to help streamers automate and enhance their chat experience.

## Features

- Multi-platform support: Kick, Twitch, YouTube (coming soon)
- Custom commands
- Command import from other popular bots (StreamElements, NightBot)
- Analytics dashboard
- User-friendly web interface

## Project Structure

The project is organized as a monorepo with the following main components:

- `apps/web`: Next.js web application for the user interface
- `apps/bot`: Bot application
- `packages/core`: Shared core functionality
- `packages/db`: Database-related code and Prisma schema
- `packages/types`: Shared TypeScript types

## Getting Started

### Prerequisites

- Node.js (v18+)
- Bun
- PostgreSQL database

### Installation

1. Clone the repository
2. Install dependencies:

```bash
bun install
```
3. Set up environment variables (refer to `.env.example` files in each app/package)
4. Generate Prisma client:

```bash
cd packages/db
bunx prisma generate
```

5. Run database migrations:

```bash
cd packages/db
bunx prisma migrate dev
```

### Development

To run the development servers:

```bash
bun run dev
```
This will start both the web application and the bot in development mode.

### Building for Production

To build the project for production:

```bash
bun run build
```
## Deployment

The project is set up for deployment using Docker and CapRover. Refer to the following files for deployment configuration:

- `Dockerfile`
- `captain-definition`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Recharts](https://recharts.org/)

## Contact

For any questions or support, please join our [Discord server](#) or visit [https://batbot.live](https://batbot.live) (offline at the moment).