import express from 'express'
//BDD
import mongoose from "mongoose";
//router
import userRouter from './routes/users.routes.js';
import productRouter from './routes/products.routes.js';
import cartRouter from './routes/carts.routes.js';
//handlebars
import {engine} from 'express-handlebars';
//path
import { __dirname } from "./path.js";
import path from 'path';
//socket.io
import { Server } from "socket.io";
//helpers
import { prodModel } from './models/product.models.js';
import { userModel } from './models/users.models.js';
import { messageModel } from './models/messages.models.js';

const app = express();
const PORT = 8080;

const server = app.listen(PORT, ()=>{
    console.log(`Server on port ${PORT}`);
})

//conexion con la BDD
mongoose.connect("mongodb+srv://johnkevin:<password>@backend-ecommers.nnjzhpe.mongodb.net/?retryWrites=true&w=majority")
  .then(()=> console.log("BDD conectada"))  
  .catch(() => console.log("Error en conexion a BDD"))

//middlaware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use("/static", express.static(path.join(__dirname, "/public")));
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, './views'));

const io = new Server(server);

io.on("connection", async (socket) => {
    console.log("Servidos Socket.io conectado");
    //esperando un 'mensaje'
    socket.on("nuevoProd", async (prod) => {
      try {
        const {title,description,price,code,stock,category} = prod;
        console.log({respuesta: "OK", mensaje: prod})
        return await prodModel.create({title,description,price,code,stock,category})
        
      } catch (error) {
        console.log("index nuevo product:", error);
      }
    });
    socket.on('pedirDatos', async ()=>{
      const datos = await prodModel.find();
      socket.emit('datos', datos);
      console.log('datos enviados');
    })
    socket.on('validatorUser', async (user)=>{
      let x = 'error'
      try{
        const users = await userModel.find()
        const indice = users.findIndex(correo => correo.email === user)
        if(indice != -1) {
          socket.emit('emailValidado', users[indice].email)
        }else{
          socket.emit('emailValidado', x)
          console.log({respuesta: "Error el buscar email", mensaje:"Email not found"})
        }
      }catch(error){
        console.log("index validar email:", error)
      }
    })

    socket.on('mensajes', async(objeto) =>{
      const email = objeto[0]
      const message = objeto[1]
      try{
        const newMessage = await messageModel.create({email, message});
        const messages = await messageModel.find();
        socket.emit("mostrarMensaje", messages);
        console.log("Mensaje enviado", newMessage)
      }catch(error){
        console.log("index mensaje:", error)
      }
    })

    socket.on('pedirDatos', async ()=>{
      try{
        const prods = await prodModel.find()
        socket.emit("datosProd", prods)
        console.log("datos enviados")
      }catch(error){
        console.log("index pedir datos:", error)
      }
    })

});

app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);


app.get('/static/chat', (req, res) =>{
    res.render('chat', {
        title : "chat message",
        css : 'style.css',
        js : 'message.js'
    })
})

app.get("/static/realtimeproducts", (req, res) => {
    res.render("realTimeProducts", {
      title: "Agregar Producto",
      css: "realTimeStyle.css",
      js: "realTimeProducts.js",
      product: listProd
    });
  });

app.get("/static/home", (req, res) => {
    res.render("home", {
      title: "home - productos",
      css: "homeStyle.css",
      js: "home.js",
    });
});
