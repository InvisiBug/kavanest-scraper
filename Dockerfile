# Use Node version 14
FROM node:14

# Create app directory within container
WORKDIR /usr/src/app

# Install app dependencies
# A wild card is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY tsconfig.json ./

# Prevents unnecessary packages from being installed
# ENV NODE_ENV=production
ENV NODE_ENV production
RUN npm install

# Copy across source folder
COPY ./dist ./

# CMD ["npm", "start"]
CMD ["node","index.js"]