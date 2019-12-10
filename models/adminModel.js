const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const AdminData=new Schema({
    title:{
        type:String,
        require:true
    },
    book_name:{
        type:String,
        require:true
    },
    book_publication:{
        type:String,
        require:true
    },
    book_author:{
        type:String,
        require:true
    },
    imagePath: {
        type: String,
        require: true
    },

    adminId:{
        type:Schema.Types.ObjectId,
        ref:'Userinfo',
        require:true
    }
    
});

module.exports=mongoose.model('BookData',AdminData);