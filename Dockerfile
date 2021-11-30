FROM node:12 as builder
WORKDIR /app
COPY . .
RUN yarn install --prod
RUN yarn build

FROM node:12-slim
COPY --from=builder /app /app
WORKDIR /app
COPY . .
EXPOSE 3000
CMD ["yarn", "start:prod"]
