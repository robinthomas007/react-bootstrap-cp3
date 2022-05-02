FROM node:17.4.0 as builder

ARG USER_DATA
ENV USER_DATA $USER_DATA

ARG VAULT_TOKEN
ENV VAULT_TOKEN $VAULT_TOKEN

WORKDIR /src

RUN apt-get update -y && apt-get install -y jq

COPY package.json package.json
COPY yarn.lock yarn.lock

RUN yarn install --immutable
COPY . .
RUN bash ./devops/scripts/buildwithvault.sh

FROM nginx:1.17 as web

WORKDIR /usr/share/nginx/html

COPY --from=builder /src/dist/ /usr/share/nginx/html/
