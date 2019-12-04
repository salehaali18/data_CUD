const mongoose=require('mongoose');
const Schema= mongoose.Schema;

const UserData=new Schema({
    name:{
        type:String,
        require:true
    },
    phone:{
        type:Number,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    user_type:{
        type:String,
        require:true
    },
    token:String,
    tokenExparition: Date

});

 

module.exports=mongoose.model('Userinfo',UserData);