# Use Node version 14
FROM node:14 as base

# Install app dependencies
# A wild card is used to ensure both package.json AND package-lock.json are copied
COPY package*.json yarn*.lock ./
COPY tsconfig.json ./

# Create app directory within container
WORKDIR /root/build

# Dependencies ---
FROM base AS dependencies

COPY package*.json yarn*.lock ./
COPY tsconfig.json ./

# Install production node_modules
RUN yarn install --frozen-lockfile --non-interactive --prefer-offline --prod

# rename prod_modules for later
RUN cp -R node_modules prod_modules

# install dev modules
RUN yarn install --frozen-lockfile --non-interactive --prefer-offline


# Build ---
FROM base AS builder

COPY . .
COPY --from=dependencies /root/build/node_modules /root/build/node_modules


FROM builder as build
RUN yarn build

# Test ---
FROM builder AS test

RUN yarn test

# Release ---
FROM base AS release

WORKDIR /usr/src/app

COPY --from=dependencies /root/build/package.json   /usr/src/app
COPY --from=dependencies /root/build/prod_modules   /usr/src/app/node_modules
COPY --from=build /root/build/dist          /usr/src/app/dist

CMD ["yarn","start"]
