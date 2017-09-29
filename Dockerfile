FROM node:alpine
COPY . /usr/src/app
WORKDIR /usr/src/app
RUN npm install
EXPOSE 8000
CMD ["node","index.js"]