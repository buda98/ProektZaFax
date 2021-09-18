FROM node:14-slim AS build
COPY . .
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=build build /usr/share/nginx/html/
RUN sed -i $'/index  index.html/a\        try_files $uri \/index.html;' /etc/nginx/conf.d/default.conf