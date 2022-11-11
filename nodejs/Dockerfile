FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:16-alpine AS server
WORKDIR /app
COPY package* ./
RUN npm install --production
COPY --from=builder ./app/build ./build
COPY ./src/.env ./build/.env
COPY ./vocal-image-login-945c6a5bd975.json ./vocal-image-login-945c6a5bd975.json
ENV PORT=8080
EXPOSE 8080
CMD ["npm", "start"]