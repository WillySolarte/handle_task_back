# Usa la imagen oficial de Node.js en su versión 20
FROM node:20.11.0-alpine

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar solo los archivos necesarios para instalar dependencias
COPY package*.json ./

# Instalar dependencias sin crear archivos temporales innecesarios
RUN npm install

# Copiar el resto del código del proyecto
COPY . .

# Exponer el puerto en el que corre NestJS
EXPOSE 3000

# Comando para iniciar la aplicación en modo desarrollo
CMD ["npm", "run", "start:dev"]
