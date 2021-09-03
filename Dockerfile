FROM node

WORKDIR /app

COPY . .

COPY package.json ./

RUN npm install

CMD ["node","app.js"]
