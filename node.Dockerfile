FROM node:14

WORKDIR /src

COPY server /src

RUN npm install

EXPOSE 1234

CMD npm start