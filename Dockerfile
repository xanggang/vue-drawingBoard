FROM node:latest as builder

WORKDIR /app

COPY /package.json /app/

# 安装依赖
RUN npm install

COPY . /app/

# 打包
RUN npm run build

FROM nginx:latest

WORKDIR /app

# 复制到nginx镜像下
COPY --from=builder /app/dist/ /app/

COPY nginx.conf /etc/nginx/nginx.conf