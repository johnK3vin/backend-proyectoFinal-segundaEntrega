import { Router } from "express";
import {userModel} from '../models/users.models.js';

const userRouter = Router()

userRouter.get('/', async (req, res) =>{
    try{
        const users = await userModel.find()
        res.status(200).send({respuesta : 'OK' , mensaje : users})
    }catch(error){
        res.status(400).send({respuesta: 'Error' , mensaje : error})
    }
})

userRouter.get('/:id', async (req, res) =>{
    const {id} = req.params
    try{
        const users = await userModel.findById(id)
        if(users){
            res.status(200).send({respuesta : 'OK' , mensaje : users})
        }else{
            res.status(404).send({respuesta: 'Error' , mensaje : 'User not found'})
        }
        
    }catch(error){
        res.status(400).send({respuesta: 'Error' , mensaje : error})
    }
})


userRouter.post('/', async (req, res) =>{
    const {nombre, apellido, edad, email, password} = req.body
    try{
        const newUser = await userModel.create({nombre, apellido, edad, email, password})
        res.status(200).send({respuesta : 'OK' , mensaje : newUser})
    }catch(error){
        res.status(400).send({respuesta: 'Error' , mensaje : error})
    }
})

userRouter.put('/:id', async (req, res) =>{
    const {id} = req.params
    const {nombre, apellido, edad, email, password} = req.body
    try{
        const users = await userModel.findByIdAndUpdate(id, {nombre, apellido, edad, email, password})
        if(users){
            res.status(200).send({respuesta : 'OK' , mensaje : users})
        }else{
            res.status(404).send({respuesta: 'Error' , mensaje : 'User not found'})
        }
    }catch(error){
        res.status(400).send({respuesta: 'Error' , mensaje : error})
    }
})

userRouter.delete('/:id' , async(req, res) =>{
    const {id} = req.params
    try{
        const delate = await userModel.findByIdAndDelete(id)
        if(delate){
            res.status(200).send({respuesta : 'OK' , mensaje : delate})
        }else{
            res.status(404).send({respuesta: 'Error en eliminar usuario' , mensaje : 'User not found'})
        }
    }catch(error){
        res.status(400).send({respuesta: 'Error', mensaje : error})
    }
})

export default userRouter;