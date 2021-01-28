FROM mhart/alpine-node:15.7.0 AS builder

ARG NPM_AUTH_TOKEN

WORKDIR /srv

COPY . .
RUN rm -rf mobile
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh libc6-compat
RUN npm config set @stoqeyx:registry https://npm.pkg.github.com
RUN npm config set //npm.pkg.github.com/:_authToken=$NPM_AUTH_TOKEN

RUN apk add --no-cache --virtual .gyp \
        python3 \
        make \
        g++ \
    && npm install \
    && apk del .gyp

RUN mkdir -p backend/src/keys && echo "{}" > backend/src/keys/service.account.json

RUN npm run be:build

# use lighter image
FROM mhart/alpine-node:slim-15.7.0
RUN apk add libc6-compat
COPY --from=builder /srv .
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "backend/build/index.js"]