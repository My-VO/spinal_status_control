FROM node:22-alpine
WORKDIR /spinal
COPY . .
RUN npm install --legacy-peer-deps
CMD ["npm", "run", "dev"]