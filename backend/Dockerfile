# Build the NestJS app
FROM node:16 AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn
COPY . .
RUN yarn build

# Run the NestJS app
FROM node:16-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY .env ./.env
EXPOSE 3001
CMD ["node", "dist/main"]
