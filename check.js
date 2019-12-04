const express=require('express');
const body_parser=require('body-parser');
const path=require('path');
const app=express();
const mongoose=require('mongoose');
const session
const uri='';


app.use(body_parser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));
app.listen(8787,()=>{
    console.log('server is running at 8787');
})