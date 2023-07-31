### .ENV ###

PORT=8080
DB_NAME=PROY BKND
MONGO_STRING=
MONGO_USER=palazzid88
MONGO_PASS=qv500UC1DtMcjUj8
GITHUB_CLIENT_ID= Iv1.27c1c117c1448b6b
GITHUB_CLIENT_SECRET= bcbdceabf553a5a0b26c812a37ec8617fefd5f9a
GITHUB_CALLBACK_URL= http://localhost:8080/api/sessions/githubcallback


#### METODOS DE REQUEST #### => 
    Son pedidos del cliente al servidor

## Método GET => 
    Es el método para solicitar información al servidor

## Método POST =>
    Es el método para enviar datos al servidor

## Método PUT => 
    Se utiliza para actualizar un recurso del servidor

## Método DELETE =>
    Se utiliza para eliminar un recurso del servidor



#### MÉTODOS DEL RESPONSE #### =>
    Son métodos de respuesta del servidor hacia el cliente

## Método SEND =>
    Envía una respuesta al cliente con el contenido especificado

## Método JSON =>
    Envía una respuesta al cliente con datos en formato JSON

## Método REDIRECT =>
    Redirige al cliente a una nueva URL

## Método STATUS =>
    Establece el código de estado HTTP de la respuesta




###### TODA PETICIÓN QUE SE HAGA DESDE EXPRESS SE DEBE REALIZAR ASINCRONICAMENTE ######
###### EN LAS FUNCIONES DEBEN UTILIZARSE ASYNC-AWAIT ######


## COMANDOS A EJECUTAR ##
* npm init -y => crea carpeta package.json
* npm i -g nodemom => monitorea los cambios 
* package.json => dentro de debug => scripts => "start" => nodemon + nombre del archivo
* npm start => ejecuta el nodemon que añadimos en el package.json
* npm i express
* crear el archivo .gitignore => con node_modules
* los archivos .js dentro de src


