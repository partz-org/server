FROM node:14-alpine

WORKDIR /usr/src/app

COPY package.json .

# We skip the 80mb mongodb-memory-server
RUN npm install --only=prod

COPY . .

CMD ["npm", "start"]