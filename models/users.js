const mongoose=require('mongoose');
const { productSchema } = require('./product');


const phoneRegex = /^\+?[0]\d{10}$/

const userSchema=mongoose.Schema({
    name:{
        required:true,
        type:String,
        trim:true
    },
    email:{
        required:true,
        type:String,
        trim:true,
        validate:{
            validator:(value)=>{
                const re= /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return value.match(re);
            },
            message:"please enter a valid email address",
        },
    },
    password:{
        required:true,
        type:String
    },
    phone: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return phoneRegex.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`,
    },
  },
    address:{
        default:'',
        type:String
    },
    type:{
        default:'user',
        type:String
    },
    cart: [
        {
            product: productSchema,
            quantity: {
                type:Number,
                required:true,
            },
        },
    ],

    
});
const User = mongoose.model("User",userSchema);
module.exports={User};