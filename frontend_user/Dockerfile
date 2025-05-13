# Sử dụng Node.js image làm base image
FROM node:16

# Đặt thư mục làm việc cho ứng dụng
WORKDIR /usr/src/app

# Copy package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt các dependencies từ package.json
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng React
RUN npm run build

# Chạy ứng dụng trên port 3000
EXPOSE 3000

# Lệnh khởi động ứng dụng
CMD ["npm", "start"]
