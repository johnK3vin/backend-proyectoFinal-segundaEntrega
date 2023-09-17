import { Router } from "express";
import { prodModel}  from '../models/product.models.js'

const productRouter = Router()

productRouter.get('/', async(req, res) =>{
    const {limit, page, category, sort} = req.query
    let link
    let query = {}
    try{
        if(category){
            query.category = category
            link = `&category=${query.category}`
        }
        let config = {
            limit : parseInt(limit) || 10,
            page : parseInt(page) || 1,
            sort : {
                price : sort || 1
            }
        }
        const prods = await prodModel.paginate(query, config)
        const respuesta = {
            status: "success",
            payload: prods.docs,
            totalPages: prods.totalPages,
            prevPage: prods.prevPage,
            nextPage: prods.nextPage,
            page: prods.page,
            hasPrevPage: prods.hasPrevPage,
            hasNextPage: prods.hasNextPage,
            prevLink: prods.hasPrevPage ? `http://${req.headers.host}${req.baseUrl}?limit=${config.limit}&page=${prods.prevPage}${link || ''}&sort=${config.sort.price}` : null,
            nextLink: prods.hasNextPage ? `http://${req.headers.host}${req.baseUrl}?limit=${config.limit}&page=${prods.nextPage}${link || ''}&sort=${config.sort.price}` : null
        }
        res.status(200).send({respuesta: "OK" ,mensaje: respuesta})
    }catch(error){
        console.log(error)
        res.status(400).send({respuesta: "Error en consultar productos", mensaje: error })
    }
}) 

productRouter.get('/:id', async(req, res) =>{
    const {id} = req.params

    try{
        const prods = await prodModel.findById(id)
        if(prods){
            res.status(200).send({respuesta: "OK" ,mensaje: prods})
        }else{
            res.status(404).send({respuesta: "Error en consultar producto", mensaje: "not found"})
        }
        
    }catch(error){
        res.status(400).send({respuesta: "Error en consultar productos", mensaje: error })
    }
})

productRouter.post('/', async(req, res) =>{
    const {title, description, code, stock, price, category} = req.body

    try{
        const prods = await prodModel.create({title, description, price, stock, code, category})
        res.status(200).send({respuesta: "OK" ,mensaje: prods})
    }catch(error){
        res.status(400).send({respuesta: "Error", mensaje: "No se logro crear producto"})
    }
})

productRouter.put('/:id', async(req, res) =>{
    const {id} = req.params
    const {title, description, code, stock, price, category, status} = req.body

    try{
        const prods = await prodModel.findByIdAndUpdate(id, {title, description, code, price, status, category, stock})
        if(prods){
            res.status(200).send({respuesta: "OK" ,mensaje: "Producto actualizado"})
        }else{
            res.status(404).send({respuesta: "Error en modificar", mensaje: "not found"})
        }
        
    }catch(error){
        res.status(400).send({respuesta: "Error en consultar productos", mensaje: error })
    }
})

productRouter.delete('/:id', async(req, res) =>{
    const {id} = req.params

    try{
        const prods = await prodModel.findByIdAndDelate(id)
        if(prods){
            res.status(200).send({respuesta: "OK" ,mensaje: "producto eliminado"})
        }else{
            res.status(404).send({respuesta: "Error en consultar producto", mensaje: "not found"})
        }
        
    }catch(error){
        res.status(400).send({respuesta: "Error en consultar productos", mensaje: error })
    }
})

export default productRouter;