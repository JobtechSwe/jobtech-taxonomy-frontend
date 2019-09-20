FROM node
COPY . /app
WORKDIR /app

# this part just makes sure there arent any compile errors
RUN npm install
RUN npm run release

# here we more or less ignore the build, and run a node instance, for the time being

EXPOSE 8000
CMD npm run  build
