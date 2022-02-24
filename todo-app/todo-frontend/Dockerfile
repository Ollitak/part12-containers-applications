FROM node:16 AS test-stage

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN CI=true npm test



FROM test-stage AS build-stage

WORKDIR /usr/src/app

COPY --from=test-stage /usr/src/app/* .

ENV REACT_APP_BACKEND_URL=api/

RUN npm run build



FROM nginx:1.20-alpine

COPY --from=build-stage /usr/src/app/build /usr/share/nginx/html

