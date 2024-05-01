FROM node:alpine

WORKDIR '/app'

# caching optimization: copy/install dependencies first!
COPY package.json .

RUN yarn install

# Copy everything else after isntalling dependencies to optimize build times by caching
COPY . . 

CMD ["yarn", "start"]