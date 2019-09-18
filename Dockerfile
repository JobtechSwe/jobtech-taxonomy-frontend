FROM node
COPY . /
RUN npm install
RUN npm run release
