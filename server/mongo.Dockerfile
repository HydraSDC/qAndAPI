FROM mongo:latest

RUN mkdir /seed/
COPY *.csv /seed/

COPY schema.sc /docker-entrypoint-initdb.d