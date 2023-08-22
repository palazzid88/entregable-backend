# Usar una imagen de Node.js como base
FROM node:18

# Directorio de trabajo dentro del contenedor
WORKDIR /src/app.js

# Copiar el archivo package.json y package-lock.json
COPY package*.json .

# Instalar las dependencias
RUN npm install

# Copiar el resto de los archivos de la aplicación
COPY . .

# Exponer el puerto en el que la aplicación va a escuchar
EXPOSE 8080

# Comando para iniciar la aplicación
CMD ["npm", "start"]