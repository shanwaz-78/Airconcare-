FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm install -g typescript

RUN npm run build

EXPOSE 8181


CMD ["npm", "run", "start"]