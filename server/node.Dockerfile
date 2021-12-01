FROM node:14

WORKDIR /server

COPY server /server

RUN npm install

EXPOSE 1234

CMD npm start