const adminModel=require('../models/adminModel');

class Adminbookdata{
constructor(title,book_name,book_publication,book_author,adminId,filePath){
    this.title=title;
    this.book_name=book_name;
    this.book_publication=book_publication;
    this.book_author=book_author;
    this.adminId=adminId;
    this.filePath = filePath;
}
book_save()
{
    const Admin_book=new adminModel({
        title:this.title,
        book_name:this.book_name,
        book_publication:this.book_publication,
        book_author:this.book_author,
        imagePath:this.filePath,
        adminId:this.adminId
    })
    return Admin_book.save()
    .then(result=>{
        return result;
    }).catch(err=>{
        console.log(err)
    })




}

static view_book(book_id){
   return adminModel.findById(book_id)
    .then(singledata=>{
        return singledata;
    })
    .catch(err=>{
        console.log(err);
    })
}

static bookUpdate(title,book_name,book_publication,book_author,book_id){

   return adminModel.findById(book_id)
    .then(details=>{    ///this details full mongoose object
        if(details){

        details.title=title;
        details.book_name=book_name;
        details.book_publication=book_publication;
        details.book_author=book_author;
   return details.save()
   .then(result=>{
      return result;
   })
   .catch(err=>{
       console.log(err);
   })
        }else{
        }
        
    })
    
    .catch(err=>{
  console.log(err);
    })
}



}


module.exports=Adminbookdata;