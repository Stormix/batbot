FROM oven/bun:latest

WORKDIR /usr/src/app

ARG DATABASE_URL=${DATABASE_URL}
ENV DATABASE_URL=${DATABASE_URL}

ARG KICK_TOKEN=${KICK_TOKEN}
ENV KICK_TOKEN=${KICK_TOKEN}

ARG KICK_COOKIES=${KICK_COOKIES}
ENV KICK_COOKIES=${KICK_COOKIES}

ARG KICK_USERNAME=${KICK_USERNAME}
ENV KICK_USERNAME=${KICK_USERNAME}

ARG KICK_CHANNEL=${KICK_CHANNEL}
ENV KICK_CHANNEL=${KICK_CHANNEL}

ARG BOT_SENTRY_DSN=${BOT_SENTRY_DSN}
ENV BOT_SENTRY_DSN=${BOT_SENTRY_DSN}

ARG RABBITMQ_URI=${RABBITMQ_URI}
ENV RABBITMQ_URI=${RABBITMQ_URI}

# Install nodejs using n
RUN apt-get -y update; apt-get -y install curl
ARG NODE_VERSION=18
RUN curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n \
    && bash n $NODE_VERSION \
    && rm n \
    && npm install -g n

COPY . .
RUN bun install

WORKDIR /usr/src/app/packages/db
RUN bunx prisma generate

WORKDIR /usr/src/app/apps/bot

EXPOSE 3001

CMD [ "bun", "run", "./src/main.ts" ]