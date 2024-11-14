# Usar una imagen base de Node.js
FROM node:16

# Establecer el directorio de trabajo en la imagen
WORKDIR /app

# Copiar el package.json y el package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar todo el código al contenedor
COPY . .

# Exponer el puerto que usará la aplicación (3000 es el puerto por defecto de React)
EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["npm", "start"]
