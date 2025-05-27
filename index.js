const express=require('express');
const mongoose=require('mongoose');
const { authRouter } = require('./routes/auth');
const { adminRouter } = require('./routes/admin');
const { productRouter } = require('./routes/product');
const userRouter = require('./routes/user');




const app=express();
app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);








const DBURL="mongodb+srv://riponraaz:yF90mZNc0aXnLYKk@cluster0.mnsapjq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const PORT=3000;


mongoose.connect(DBURL).then(()=>{
    console.log("MongoDB is connected");
    app.listen(PORT ||5000,"0.0.0.0",()=>{
        console.log("Servers is running on port "+PORT);
    });
});

