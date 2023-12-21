# build stage
FROM node:16.17.0-alpine3.16 as build-stage
WORKDIR /app
ENV BASE_API_URL //singlecell.siais.shanghaitech.edu.cn/api
COPY package.json yarn.lock .yarnrc ./
RUN yarn
COPY . .
RUN yarn build

# production stage
FROM nginx:stable as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
