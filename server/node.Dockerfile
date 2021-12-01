FROM node:14

WORKDIR /qAndAPI

COPY /server/app.js

RUN npm install

EXPOSE 1234

CMD npm start