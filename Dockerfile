FROM node:latest
WORKDIR /spinal
COPY . .
RUN npm install --legacy-peer-deps
CMD ["npm", "run", "dev"]