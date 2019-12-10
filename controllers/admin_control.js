const adminModel=require('../models/adminModel');
const Admindetails=require('../repository/admin_repository');
const UserModel=require('../models/userModel');
    exports.getDashboard=(req,res,next)=>{

        const data  = req.session.login_admin_data;
    
        if(data.user_type === 'user'){
            res.render('dashboard',{
                title:'dashboard',
                data:data,
                user_type:data.user_type,
            })
    
    
        }
        else{
            UserModel.find()
            .then(alldata=>{
                res.render('dashboard',{
                    title:'dashboard',
                    data:alldata,
                    user_type:"admin",
                })
            })
            .catch(err=>{
                console.log(err);
            })
        
    
        }
    
       
       
           
         }
// adminModel.find()
// .then(allbook=>{
//     res.render('dashboard',{
//         title:'dashboard',
//         data:allbook
//     })
// })
// .catch(err=>{
//     console.log(err);
// })
   

exports.getNewDashboard=(req,res,next)=>{
    const data  = req.session.login_admin_data;
    if (data.user_type==='admin') {
        adminModel.find()
        .then(allbook=>{
                res.render('new_book_dashboard',{
                    title:'dashboard',
                    data:allbook
                })
            })
        .catch(err=>{
            console.log(err);
        })
    }else{
   
        adminModel.find({adminId:req.session.login_admin_data._id})
        .then(allbook=>{
            console.log
            res.render('new_book_dashboard',{
                title:'new dashboard',
                data:allbook
            })
        })
        .catch(err=>{
            console.log(err);
        })
        }
}


exports.getAddBook=(req,res,next)=>{
    res.render('add_new_book',{
        title:'add book',
        editable:false
    })
}
exports.postAddbook=(req,res,next)=>{
// const admin=new adminModel({
//     title:req.body.title,
//     book_name:req.body.book_name,
//     book_publication:req.body.book_publication,
//     book_author:req.body.book_author

// })


const admin=req.session.login_admin_data._id;

const filePath = req.file.path;
// if(!filePath){

// }
// else{

// }
const Admindata=new Admindetails(req.body.title,req.body.book_name,
    req.body.book_publication,req.body.book_author,admin,filePath)
return Admindata.book_save()
.then(result=>{
    console.log(result);
console.log('book added');
res.redirect('/dashboard');
})
.catch(err=>{
    console.log(err);
})
   
}
exports.getBook=(req,res,next)=>{
    const book_id=req.params.id;
  Admindetails.view_book(book_id)
  .then(singledata=>{
        res.render('single_book_details',{
            title:'single Data',
            data:singledata
        })
    })
    .catch(err=>{
        console.log(err);
    })


    // adminModel.findById(book_id)
    // .then(singledata=>{
    //     res.render('single_book_details',{
    //         title:'single Data',
    //         data:singledata
    //     })
    // })
    // .catch(err=>{
    //     console.log(err);
    // })
   
}

exports.deleteDetails=(req,res,next)=>{
    const book_id=req.params.id;
    adminModel.findByIdAndRemove(book_id)
    .then(()=>{
        res.redirect('/dashboard');

    }).catch(err=>{
        console.log(err);
    })
}

exports.postUpdatebook=(req,res,next)=>{
    const book_id=req.body.id;
    const title=req.body.title;
    const book_name=req.body.book_name;
    const book_publication=req.body.book_publication;
    const book_author=req.body.book_author;
    const filePath = req.file.path;

    Admindetails.bookUpdate(title,book_name,book_publication,book_author,book_id,filePath)
    .then(result=>{
        console.log('update values');
        res.redirect('/dashboard');
    })
    .catch(err=>{
        console.log(err);
    })

   
//     adminModel.findById(book_id)
//     .then(details=>{    ///this details full mongoose object
//         if(details){

//         details.title=req.body.title;
//         details.book_name=req.body.book_name;
//         details.book_publication=req.body.book_publication;
//         details.book_author=req.body.book_author;
//    return details.save()
//    .then(result=>{
//        console.log('update value');
//        res.redirect('/dashboard');
//    })
//    .catch(err=>{
//        console.log(err);
//    })
//         }else{
//         }
        
//     })
    
//     .catch(err=>{
//   console.log(err);
//     })
    
    

}
   










// exports.postUpdatebook=(req,res,next)=>{
// const update_title=req.body.title;
// const update_book_name=req.body.book_name;
// const update_book_publication=req.body.book_publication;
// const update_book_author=req.body.book_author;
// const update_book_id=req.body.id;

// const adminbook=new adminbookdata(update_title,update_book_name,update_book_publication,update_book_author,update_book_id);
// adminbook.book_save()
// .then(result=>{
//     res.redirect('/dashboard');
// })
// .catch(err=>{
//     console.log(err);
// })
// }

exports.getEditableValue=(req,res,next)=>{
   const book_id=req.params.id;
   const editmode=req.query.edit;
   
   adminModel.findById(book_id)
   .then(singleData=>{
       res.render('add_new_book',{
           title:"Update Data",
           data:singleData,
           editable:editmode
       })
   })
   .catch(err=>{
       console.log(err);
   })
}

exports.deleteDetails=(req,res,next)=>{
    const book_id=req.params.id;
    adminModel.findByIdAndRemove(book_id)
    .then(()=>{
        res.redirect('/dashboard');
    })
    .catch(err=>{
        console.log(err);
    })
 }