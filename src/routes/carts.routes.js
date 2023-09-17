import { Router } from "express";
import {cartModel} from '../models/carts.models.js';
import { prodModel } from "../models/product.models.js";

const cartRouter = Router();

cartRouter.get('/:id', async(req, res) =>{
    const {id} = req.params
    try{
        const carts = await cartModel.findById(id)
        if(carts){
            res.status(200).send({resputa: "OK" , mensaje: carts})
        }else{
            res.status(404).send({respuesta: "Error en consultar carrrito", mensaje: "carts not found"})
        }
        
    }catch(error){
        res.status(400).send({respuesta: "Error", mensaje: error})
    }
})

cartRouter.post('/', async(req, res) =>{
    try{
        const carts = await cartModel.create({})
        res.status(200).send({respuesta: "OK" ,mensaje: carts})
    }catch(error){
        res.status(400).send({respuesta: "Error", mensaje: "No se logro crear carrito"})
    }
})

cartRouter.post('/:cid/products/:pid', async(req, res) =>{
    const {cid, pid} = req.params
    const {quantity} = req.body
    try{
        const cart = await cartModel.findById(cid)
        if(cart){
            const prod = await prodModel.findById(pid)
            if(prod){
                const indice = cart.products.findIndex(prod => prod.id_prod == pid)
                if(indice != -1){
                    cart.products[indice].quantity += quantity
                }else{
                    cart.products.push({id_prod: pid, quantity: quantity})
                }
                const respuesta = await cartModel.findByIdAndUpdate(cid, cart)
                res.status(200).send({respuesta: "OK" , mensaje: respuesta})
            }else{
                res.status(404).send({respuesta: "Error al buscar Producto" ,mensaje: "Product not Found"})
            }
        }else{
            res.status(404).send({respuesta: "Error al buscar carrito" ,mensaje: "Carrito not Found"})
        }
    }catch(error){
        console.log(error)
        res.status(400).send({respuesta: "Error", mensaje: "No se logro crear carrito"})
    }
})


cartRouter.delete('/:cid', async (req, res) => {
    const { cid } = req.params
    try {
        await cartModel.findByIdAndUpdate(cid, { products: [] })
        res.status(200).send({ respuesta: 'ok', mensaje: 'Carrito vacio' })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error al vaciar carrito', mensaje: error })
    }
})

cartRouter.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params
    try {
        const cart = await cartModel.findById(cid)
        if (cart) {
            const prod = await prodModel.findById(pid)
            if (prod) {
                const indice = cart.products.findIndex(item => item.id_prod._id.toString() == pid)
                if (indice !== -1) {
                    cart.products.splice(indice, 1)
                }
            }
        }
        const respuesta = await cartModel.findByIdAndUpdate(cid, cart)
        res.status(200).send({ respuesta: 'OK', mensaje: respuesta })
    } catch (error) {
        res.status(400).send({ respuesta: 'Error al eliminar producto del carrito', mensaje: error })
    }
})

cartRouter.put('/:cid', async (req, res) => {
    const { cid } = req.params
    const prodArray = req.body.products

    if (!Array.isArray(prodArray)) {
        return res.status(400).send({ respuesta: 'Error', mensaje: 'array no encontrado' })
    }

    try {
        const cart = await cartModel.findById(cid)
        if (!cart) {
            console.log("carrito no encontrado")
        }
        for (let prod of prodArray) {
            const indice = cart.products.findIndex(cartProduct => cartProduct.id_prod.toString() === prod.id_prod)

            if (indice !== -1) {
                cart.products[indice].quantity = prod.quantity
            } else {
                const existe = await prodModel.findById(prod.id_prod)
                if (!existe) {
                    console.log("No se ha encontrado el producto con el id proporcionado")
                }
                cart.products.push(prod)
            }
        }
        const respuesta = await cartModel.findByIdAndUpdate(cid, cart)
        res.status(200).send({ respuesta: 'OK', mensaje: respuesta })
    } catch (error) {
        res.status(error.message.includes("error al modificar carrito") ? 404 : 400).send({ respuesta: 'Error', mensaje: error.message })
    }
})

cartRouter.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params
    const { quantity } = req.body

    try {
        const cart = await cartModel.findById(cid)
        if (cart) {
            const prod = await prodModel.findById(pid)
            if (prod) {
                const index = cart.products.findIndex(prod => prod.id_prod._id.toString() === productId)
                if (index !== -1) {
                    cart.products[index].quantity = quantity
                } else {
                    cart.products.push({ id_prod: productId, quantity: quantity })
                }
            }
        }

        res.status(200).send({ respuesta: 'OK', mensaje: 'Carrito actualizado' })
    } catch (error) {
        res.status(error.message.includes("error al modificar carrito") ? 404 : 400).send({ respuesta: 'Error', mensaje: error.message })
    }
})



export default cartRouter;

