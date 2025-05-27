const jwt = require('jsonwebtoken');
const { User } = require('../models/users');

const admin=async(req, res, next)=>{
try {
const token=req.header("x-auth-token");

if(!token)
    return res.status(401).json({msg:"No auth token,access denied"});
const varified=jwt.verify(token,"passwordKey");
      if(!varified) res.status(401).json({msg:"Token varification faild,access denied"});
const user=await User.findById(varified.id);

if (user.type=="user" || user.type=="seller"){
    return res.status(401).json({msg:"You are not an admin"});
}
req.user = varified.id;
req.token=token;
next();

} catch(e){
res.status(500).json({error:e.message});
    
}
    
}

module.exports=admin;