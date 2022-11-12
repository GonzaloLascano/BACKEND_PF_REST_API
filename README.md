 # 💻 CoderHouse Back End 💻 # 

## Proyecto Final: Ecommerce Rest API con Chat Websocket. 

Proyecto de API REST, que permite cargar modificar borrar y listar, tanto productos como carritos en su propia base de datos en MongoDB. Ademas de proporcionar un sistema de registro de usuarios, tambien almacenados en MongoDB, que les permitirá loguearse para acceder mediante autenticacion a las distintas funcionalidades, algunas de ellas solo disponibles para administradores y registrar sesiones con una duracion limitada.
Ademas de eso, hay un sistema de chat con websockets a traves del cual se van a registrar consultas y dialogos directos con los administradores de la pagina.
Se creo tratando de seguir lo mas fielmente posible el MVC

## **🛠 Se utilizaron las siguientes herramientas:**

 - **NodeJS** 
 - **Dependencias:**
	 - *Express (Express session)*   
	 - *Mongoose*
	 -  *Passport (passport-local)*   
	 - *Websockets*   
	 - *Handlebars*   
	 - *Twilio*   
	 - *Nodemailer*

 - **Utilitarios:**
	 - bcrypt
	 - log4js
	 - connect-mongo
	 - connect-flash
     

### Modo de implementación 
---

Como cualquier API REST, el servidor consta de varios endpoints segun el tipo de solicitud que se le hace. Tratando de devolver siempre un objeto JSON con un mensaje de respuesta. En caso de solicitar informacion, la info solicitada, en caso de haber un error, informacion sobre el mismo, y en caso de alguna confirmacion, el estado de la misma.
___

**Productos:**

Los endpoints para productos, requieren todos de autenticacion de administrador para poder ser modificados a excepción de los que son para listar.

 - GET = 'api/productos/`(:code || :_id ||?category)`'
 
>A este endpoint podemos pasarle la solicitud de el o los productos que queremos listar de la siguiente manera: 
con el codigo de producto, con el _id del producto (generado automaticamente por mongo al momento de listarlo), a traves de query params con la categoria de productos deseada.

 - POST = 'api/productos/' 
 - PUT = 'api/productos/`:id`'
 
>Ambos actualizan la base de datos con el contenido de req.body. Requiere permisos de administrador

 - DELETE = 'api/productos/`:id`'  
 
 >Borra de la base de datos el producto cuyo por id.
 ___

**Carritos:**

>Practicamente todos los endpoints de carritos requieren autenticacion, aunque solo los de crear y eliminar carrito requieren nivel de administrador.

 - GET = 'api/carritos/`:id`/productos'

>lista unicamente los productos del carrito cuyo parametro id es pasado por params. Devuelve la lista de productos dentro del carrito.

 - POST = 'api/carritos/'

>crea un carrito nuevo, sin usuario asignado. Devuelve un objeto JASON que envuelve el carrito creado y un mensaje de confirmacion.

 - POST = 'api/carritos/`:id`/productos/`:code`'

>Modifica el stock del producto pasado por code a traves de params del carrito seleccionado por id. Si no existe, lo agrega. Devuelve un JSON que contiene el producto modificado. Si este fue agregado al carrito devuelve tambien un mensaje de exito.

 - DELETE = '/api/carritos/`:id`'

>Elimina el carrito passado por params. Devuelve un JSON con un mensaje de confirmacion.

 - DELETE = '/api/carritos/`:id`/productos/`:id_prod`'

>Borra del carrito seleccionado los productos indicados por id. Devuelve un JSON con un mensaje de confirmacion.

 - POST = '/api/carritos/`:id`/purchase'

>Inicia el proceso de compra del carrito seleccionado. En el req.body debe cargarse la dirección de envío y la info de pago.(el middleware de cobros, deberia validar la informacion de estos campos y devolver un error correspondiente de ser necesario. Notese que una vez confirmado el pago (el cual en esta api está simulado como una consulta a una api de pagos) el carrito no es eliminado, sino que su propiedad "purchased" pasa a ser "true" y al usuario que lo tenia asignado se le asigna un nuevo carrito vacío. Envia un mensaje por whatsapp de confirmacion y un email con la orden de compra (el id del carrito) tanto al usuario como al administrador. Devuelve un JSON confirmando el resultado de la operacion.
___

**Usuarios:**

 - GET = '/users/reg'
	 - = '/users/login'

>Son endpoints pensados mas que anda para pruebas. Devuelven un render de las plantillas con los formularios correspondientes.

 - POST = '/users/reg'
	 - = '/users/login'

>Ambos ejecutan el middleware de autenticacion de passport. Reg para registrar el usuario (los parametros se pasan por req.body) y Login para loguearse. El usuario es redireccionado segun el resultado del proceso. Despues del registro es logueado automaticamente.   

 - GET = 'users/logout'

>Da por finalizada voluntariamente la session.

 - GET = '/users/failure'

>En caso de error durante los procesos de passport, el usuario es redireccionado a este destino y devuelto un mensaje de error correspondiente segun lo ocurrido. 

-------
Gonzalo Ivan Puñales Lascano - 