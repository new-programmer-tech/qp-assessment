# base image
FROM node:18

ENV DATABASE_URL="postgresql://grocery_booking_owner:npg_kn1OHRWIYUu0@ep-fragrant-wildflower-a16v58id-pooler.ap-southeast-1.aws.neon.tech/grocery_booking?sslmode=require"

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . . 

RUN npx prisma generate

EXPOSE 5000

# Start the application
CMD ["npm", "start"]