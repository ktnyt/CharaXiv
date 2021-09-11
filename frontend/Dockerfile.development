FROM node:14.17.6-alpine AS base
WORKDIR /app
RUN npm install -g npm

FROM base AS deps
COPY ./package.json /app
COPY ./package-lock.json /app
RUN npm install

FROM base
COPY --from=deps /app/node_modules /app/node_modules
COPY . /app
CMD ["npm", "run", "dev"]
