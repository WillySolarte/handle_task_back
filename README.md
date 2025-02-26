
# Development
Pasos para levantar la app 


1. Levantar la base de datos
```
docker compose up -d
```
2. Ejecutar el comando ```  docker build -t nest-app .  ``` para crear la imagen de node y su verisón
3. Ejecutar el comando ```  docker container run -p 3000:3000 nest-app ``` para levantar el contenedor
4. Crear una copia de el .env.example y renombrarlo a .env
5. Ejecutar el comando ```npm install``` para reconstruir los módulos de node
6. Ejecutar el comando ```npm run start:dev``` para ejecutar aplicación en desarrollo



# Prod


# Stage
