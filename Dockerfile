FROM node:16-alpine

EXPOSE 2525

# Should I create a directory???

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ADD package.json /usr/src/app

RUN yarn

ADD src /usr/src/app/

CMD ["node", "smtp-server"]