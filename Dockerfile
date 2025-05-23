FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"] 