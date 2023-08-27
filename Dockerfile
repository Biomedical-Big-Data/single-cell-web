# build stage
FROM node:16.17.0 as build-stage
WORKDIR /app
COPY package.json yarn.lock .yarnrc ./
RUN yarn
COPY . .
RUN yarn build

# production stage
FROM nginx:stable as production-stage
#RUN rm /etc/nginx/conf.d/default.conf
#COPY nginx.conf /etc/nginx/conf.d/:default.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
