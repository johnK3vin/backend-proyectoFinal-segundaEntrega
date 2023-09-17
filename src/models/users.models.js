import { Schema, model } from "mongoose";

const userShema = new Schema({
    nombre : {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    edad : {
        type: Number,
        required: true
    },
    email : {
        type : String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

export const userModel = model('users', userShema)