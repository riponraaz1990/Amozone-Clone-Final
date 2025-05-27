const express=require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models/users');
const auth = require('../middlewares/auth');

const authRouter=express.Router();

authRouter.post('/api/signup',async(req,res)=>{
    try{
        const {name,email,phone,password}=req.body;
        const existingUser=await User.findOne({email});
        const existingPhone=await User.findOne({phone});
        if(existingUser){
            return res.status(400).json({msg:"User with same email already exists"});
        };
        if(existingPhone){
            return res.status(400).json({msg:"User with same phone already exists"});
        };


const hasPassword=await bcrypt.hash(password,8);

        let user=new User({
    name,
    email,
    phone,
    password:hasPassword
        });
        
        user=await user.save();
        res.status(200).json({msg:"Successful",user});
    }catch(e){
res.status(500).json({error: e.message});
    }
});


authRouter.post('/api/signin',async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({msg:"user with same email does not exists"});
        }
const isMatch=await bcrypt.compare(password,user.password);

if(!isMatch){
    return res.status(400).json({msg:"Incorrect Password"});
}
const token= jwt.sign({id: user._id},"passwordKey");
res.json({token, ...user._doc});
        
    }catch(e){
res.status(500).json({error: e.message});
    }
});


authRouter.post('/api/tokenIsValid',async(req,res)=>{
    try{
    
      const token = req.header('x-auth-token');
      if(!token) return res.json(false);
      const varified=jwt.verify(token,'passwordKey');
      if(!varified) return res.json(false);
      const user=await User.findById(varified.id);
      if(!user) return res.json(false);
      return res.json(true);

    }catch(e){
res.status(500).json({error: e.message});
    }
});


authRouter.get('/', auth, async(req,res)=>{
const user = await User.findById(req.user);
res.json({...user._doc,token:req.token});

});


authRouter.put('/api/users/:id/phone', async (req, res) => {
  try {
    const { phone } = req.body;
    const existingPhone=await User.findOne({phone});
    if(existingPhone){
            return res.status(400).json({msg:"User with same phone already exists"});
        };
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { phone },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
});

authRouter.put('/api/users/:id/address', async (req, res) => {
  try {
    const { address } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { address },
      { new: true },
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error.', error });
  }
});

module.exports={authRouter};