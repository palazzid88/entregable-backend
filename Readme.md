# Entregables Backend

Bienvenido al README de Entregables Backend! 🚀

## Descripción

Este proyecto backend es parte de un sistema de gestión de entregables. Proporciona servicios de autenticación de usuarios, manejo de productos y comunicación en tiempo real. Utiliza tecnologías como Express, MongoDB y otras librerías populares para lograr funcionalidades robustas.
Este proyecto backend forma parte de mi experiencia educativa en la plataforma Coderhouse. Es parte del curso de front end y es una parte crucial en el recorrido para completar el curso de full stack utilizando la metodología MERN (MongoDB, Express, React y Node.js).


## Tecnologías y Librerías

El proyecto se desarrolló utilizando las siguientes tecnologías y librerías:

- [Express](https://expressjs.com): Framework de aplicaciones web para Node.js.
- [MongoDB](https://www.mongodb.com): Base de datos NoSQL utilizada para el almacenamiento de datos.
- [Mongoose](https://mongoosejs.com): Biblioteca para modelar objetos MongoDB en una aplicación Node.js.
- [bcrypt](https://www.npmjs.com/package/bcrypt): Para el hashing seguro de contraseñas.
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken): Para la generación y verificación de tokens JWT.
- [express-session](https://www.npmjs.com/package/express-session): Middleware para manejar sesiones en Express.
- [passport](http://www.passportjs.org): Middleware para autenticación en Node.js.
- [nodemailer](https://nodemailer.com): Librería para enviar correos electrónicos.
- [socket.io](https://socket.io): Biblioteca para comunicación en tiempo real.
- [winston](https://github.com/winstonjs/winston): Para el registro (logging) de eventos.

... y otras librerías que se encuentran detalladas en el archivo `package.json`.



## Estructura de Directorios

La estructura de directorios de la aplicación es la siguiente:

/
├── src/
│ ├── config/
│ ├── controllers/
│ ├── DAO/
│ ├── middlewares/
│ ├── public/
│ ├── routes/
│ ├── services/
│ ├── utils/
│ ├── views/
│ ├── routes/
│ ├── config/
│ ├── app.js
│ ├── configure.socket.js
├── package.json
├── ...




## Instalación

Para poner en marcha y ejecutar la aplicación en tu entorno local, sigue estos pasos:

1. **Clonar el Repositorio:**

git clone https://github.com/palazzid88/entregable-backend.git
cd entregable-backend


2. **Instalar Dependencias:**

Asegúrate de tener Node.js y npm instalados en tu máquina, luego ejecuta:
npm install


3. **Configurar Variables de Entorno:**
Crea un archivo `.env` en la raíz del proyecto con las variables de entorno necesarias. Puedes consultar un archivo `.env.example` como guía.


4. **Ejecutar la Aplicación:**
Una vez que hayas configurado las variables de entorno en el archivo `.env`, puedes iniciar la aplicación:
npm start

La aplicación estará disponible en: `http://localhost:8080`

Si tienes alguna pregunta o encuentras algún problema durante la instalación, no dudes en contactarme en [correo@example.com].



## Curso a cargo de:
    ** Profesor: Guillermo Fergnanni
    ** Tutora: Laura Acuña



## Estado del Proyecto

Este proyecto se encuentra en desarrollo activo y sigue recibiendo actualizaciones y mejoras.