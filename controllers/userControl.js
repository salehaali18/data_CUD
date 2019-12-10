UserModel=require('../models/userModel');
// AdminModel=require('../models/Admindata');
const bcrypt=require('bcryptjs');
const crypto=require('crypto');
const {validationResult} =require('express-validator/check');


const nodeMailer = require('nodemailer');
const sendGrid = require('nodemailer-sendgrid-transport');
const transporter=nodeMailer.createTransport(
    sendGrid({
    auth:{
        api_key:'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',
    }
}))




exports.getHomePage=(req,res,next)=>{
    res.render('index',{
        title:'HOME PAGE'
        
    })
}

exports.getLoginPage=(req,res,next)=>{
res.render('login',{
    title:'LOGIN PAGE',
    error:null
})
}

exports.getRegisterPage=(req,res,next)=>{
res.render('register',{
    title:'REGISTERATION PAGE',
    editable:false,
    error:null,
    jsonerror:[]
    
})
}

exports.getResetPage=(req,res,next)=>{
res.render('reset',{
    title:"reset page"
})
}


exports.postPasswordReset=(req,res,next)=>{
    UserModel.findOne({email:req.body.email})
    .then(emailExistorNot=>{
        if(emailExistorNot) {
            crypto.randomBytes(32,(err,buffer)=>{
                if(!err){
                    let token=buffer.toString('hex');
                    //console.log(token);
                    emailExistorNot.token=token;
                    emailExistorNot.tokenExparition=Date.now()+3600000;
                    return emailExistorNot.save()
                    .then(result=>{
                        res.redirect('/login');
                        transporter.sendMail({
                            from:'salehaali9900@gmail.com',
                            to:req.body.email,
                            subject:'update Message',
                            html:`<h1>for update click to link <a href="http://localhost:1010/newpasspage/${token}">UPDATE PAGE</a></h1>`
                        })
                    })
                    .catch(err=>{
                        console.log(err);
                    })

                }else{
                    console.log(err);
                }
            })
        }else{
            console.log('email not exist ');
            res.redirect('/login')
        }
    })
    .catch(err=>{
        console.log(err);
    })
}


exports.getnewpasspage=(req,res,next)=>{
const fetch_token=req.params.token;
UserModel.findOne({token:fetch_token,tokenExparition:{$gt:Date.now()}})
.then(admindata=>{
    if(admindata){
res.render('newpasspage',{
    fetch_token:fetch_token,
    adminId:admindata._id
});
    }else{
        console.log('token expire');

    }
})
.catch(err=>{
    console.log(err);
})
}


exports.postUpdatePass=(req,res,next)=>{
    const new_password = req.body.newpassword;
    const old_password = req.body.oldpassword;
    const user_id = req.body.admin_id;
    const password_token = req.body.token;
UserModel.findById(user_id)
.then(admin=>{
    return bcrypt.compare(old_password,admin.password)
    .then(passwordmatch=>{
        if (passwordmatch) {
            return bcrypt.hash(new_password,12)
            .then(hashpass=>{
                return bcrypt.compare(new_password,admin.password)
                .then(passmatch=>{
                    if (passmatch) {
                        console.log('old and new password cannot match')
                        res.redirect('/newpasspage');;
                    }else{
                    return UserModel.findOne({
                        token:password_token,
                        tokenExparition:{$gt:Date.now()},
                        _id:user_id
                    })
                    .then(admin=>{
                        admin.password=hashpass;
                        admin.token=null;
                        admin.tokenExparition=null;
                        return admin.save()
                        .then(result=>{
                            console.log('password succesfully update');
                            res.redirect('/login');
                        })
                        .catch(err=>{
                            console.log(err);
                        })
                    })
                    .catch(err=>{
                        console.log(err);
                    })
                    }
                })
                .catch(err=>{
                    console.log(err);
                })
            })
            .catch(err=>{
                console.log(err);
            })
        }else{
            console.log("old password not match")
        }
    })
    .catch(err=>{
        console.log(err);
    })
})
.catch(err=>{
    console.log(err);
})
}

// exports.getDashboard=(req,res,next)=>{

//     const data  = req.session.login_admin_data;

//     if(data.user_type === 'user'){
//         res.render('dashboard',{
//             title:'dashboard',
//             data:data,
//             user_type:data.user_type,
//         })


//     }
//     else{
//         UserModel.find()
//         .then(alldata=>{
//             res.render('dashboard',{
//                 title:'dashboard',
//                 data:alldata,
//                 user_type:"admin",
//             })
//         })
//         .catch(err=>{
//             console.log(err);
//         })
    

//     }

   
   
       
//      }

exports.postRegisterUser=(req,res,next)=>{

    const validation=validationResult(req);

    const error = JSON.stringify(validation.array());

    // console.log(JSON.parse(error));
     
if (!validation.isEmpty()) {
    res.render('register',{
        title:'register',
        error:validation.array()[0].msg,
        editable:false,
        jsonerror:JSON.parse(error)
        
    })
}else{
    UserModel.findOne({email:req.body.email})
    .then(emailifexist=>{
        if(emailifexist){
             console.log(emailifexist);
            console.log('email already exist');
            res.redirect('/register')
        }else{
            bcrypt.hash(req.body.password,12)
            .then(hasspass=>{
                const user=new UserModel({
                    name:req.body.name,
                    phone:req.body.phone,
                    email:req.body.email,
                    password:hasspass,
                    user_type:'user'
                    
                })
                return user.save()
                .then(()=>{
                    console.log('successfully register');
                    res.redirect('/login');
                    transporter.sendMail({
                        from:'salehaali9900@gmail.com',
                        to:req.body.email,
                        subject:'Registration Message',
                        html:'<h1>Registration Successful click to login <a href="http://localhost:1010/login">Login Page</a></h1>'
                    })
                })
                
            }).catch(err=>{
                console.log(err)
            })
            
        }
    }).catch(err=>{
        console.log(err)
    })
}
    
}


exports.postLoginUser = (req,res,next)=>{
    const validation=validationResult(req);
    if (!validation.isEmpty()) {
        res.render('login',{
            title :'login',
            error :validation.array()[0].msg
        })
    } else{
        UserModel.findOne({email:req.body.email})
        .then(emailexist=>{
            if(!emailexist){
                console.log(emailexist)
                console.log('email not exist try new ');
                res.redirect('/register')
            }
            else{
             if(emailexist.user_type==="admin"){
                bcrypt.compare(req.body.password,emailexist.password)
                .then(passwordmatch=>{
                    if(passwordmatch){
                        return UserModel.findById(emailexist._id)
                        .then(single_data=>{
                            req.session.isLoggedIn = true;
                            req.session.login_admin_data=single_data;
    
                            req.session.save(err=>{
                                if(!err){
                                    res.redirect('/dashboard');
                                }
                                else{
                                    console.log('session not saved');
                                }
                            })
                        })
                        .catch(err=>{
                            console.log(err);
                        })
                    }
                    else{
                        console.log('Password incorrect');
                        res.redirect('/login');
                    }
                })
                .catch(err=>{
                    console.log(err);
                })
             }else{
                bcrypt.compare(req.body.password,emailexist.password)
                .then(passwordmatch=>{
                    if(passwordmatch){
                        return UserModel.findById(emailexist._id)
                        .then(single_data=>{
                            req.session.isLoggedIn = true;
                            req.session.login_admin_data=single_data;
    
                            req.session.save(err=>{
                                if(!err){
                                    res.redirect('/dashboard');
                                }
                                else{
                                    console.log('session not saved');
                                }
                            })
                        })
                        .catch(err=>{
                            console.log(err);
                        })
                    } //
                    else{
                        console.log('Password not match');
                        res.redirect('/login');
                    }
                    // if(passwordmatch){
                    //    UserModel.findById(emailexist._id)
                    //    .then(single_data=>{
                    //        res.render('dashboard',{
                    //            title:'dashboard',
                    //            user_type:emailexist.user_type,
                    //            data:single_data
                               
                    //        })
                    //        UserModel.findById(emailexist._id)
                    //        .then(singleuser=>{
                    //         req.session.isLoggedIn = true;
                    //         req.session.login_admin_data=singleuser
                    //         return req.session.save(err=>{
                    //             if(err){
                    //                 console.log(err);
                    //             }else{
                    //                 res.redirect('/dashboard');
                    //             }
                    //         })
                    //        }).catch()
                           
                    //    })
                    //    .catch(err=>{
                    //        console.log(err);
                    //    })
                    // }
                    // else{
                    //     console.log('Password incorrect');
                    //     res.redirect('/login');
                    // }
                })
                .catch(err=>{
                    console.log(err);
                })
             }
             
            
            }
        }).catch(err=>{
            console.log(err);
        })
    }
    
}

exports.getAdminLogin=(req,res,next)=>{
res.render('admin',{
    title:'admin'
})
}







exports.postUpdate=(req,res,next)=>{
    const user_id=req.body.id;
    UserModel.findById(user_id)
    .then(details=>{
    // //     details.phone=req.body.phone;
    // //     details.password=req.body.password;
    
    // // return details.save()
    
    //                 .then(result=>{
    //                     console.log('updated');
    //                     res.redirect('/dashboard');
    //                 }).catch(err=>{
    //                     console.log(err);
    //                 })


    bcrypt.compare(req.body.password,details.password)
    .then(domatch=>{
        if(!domatch){
 return bcrypt.hash(req.body.password,12)
 .then(updatehass=>{
    details.phone=req.body.phone;
   details.password=updatehass;
   return details.save()
   .then(result=>{
    console.log('updated');
     res.redirect('/dashboard');
             }).catch(err=>{
                        console.log(err);
                    })
})
.catch(err=>{
    console.log(err);
})
        }else{
console.log('password not correct');
        }
    })
    .catch(err=>{
        console.log(err);
    })
    .catch(err=>{
        console.log(err);
    })
})
}





// exports.postUpdate=(req,res,next)=>{
//     UserModel.findOne({email:req.body.email})
//     .then(emailexist=>{
//         if(!emailexist){
//             console.log(emailexist)
//             console.log('email not exist try new ');
//             res.redirect('/register')
//         }
//         else{
//          bcrypt.compare(req.body.password,emailexist.password)
//          .then(passwordmatch=>{
//              if(passwordmatch){
//                 const user_id=req.body.id;
//                 UserModel.findById(user_id)
//                 .then(details=>{
//                     details.phone=req.body.phone;
//                  details.password=passwordmatch;
    
//                 })

//                 return details.save()
//                 .then(result=>{
//                                             console.log('updated');
//                                             res.redirect('/dashboard');
//                                         }).catch(err=>{
//                                             console.log(err);
//                                         })
//                 .catch()
//                 .catch()
//              }
//              else{
//                  console.log('Password incorrect');
//                  res.redirect('/login');
//              }
//          })
//          .catch(err=>{
//              console.log(err);
//          })
        
//         }
//     }).catch(err=>{
//         console.log(err);
//     })
// }








//     bcrypt.compare(req.body.password,detail.password)
//     .then(domatch=>{
//         if(domatch){
//             details.phone=req.body.phone;
//             details.password=req.body.password;
//             return details.save()
//             .then(result=>{
//                         console.log('updated');
//                         res.redirect('/dashboard');
//                     }).catch(err=>{
//                         console.log(err);
//                     })
//         }else{}
//     })
//     .catch()

//     })
// }



    //     details.password=req.body.password;
    //     return details.save()
    //     .then(result=>{
    //         console.log('updated');
    //         res.redirect('/dashboard');
    //     }).catch(err=>{
    //         console.log(err);
    //     })
    // })
    // .catch(err=>{
    //     console.log(err);
        


exports.getedit=(req,res,next)=>{
    const user_id=req.params.id;
    const editmode=req.query.edit;
    
    UserModel.findById(user_id)
    .then(singleData=>{
        res.render('register',{
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
    const user_id=req.params.id;
    UserModel.findByIdAndRemove(user_id)
    .then(()=>{
        res.redirect('/dashboard');

    }).catch(err=>{
        console.log(err);
    })
 
}
 


exports.postLogout =(req ,res,next)=>{
    // res.render('index',{
    //     title:'Home page'
       
    // })

    req.session.destroy(err=>{
        if(!err){
            res.redirect('/')
        }
        else{
            console.log(err);
        }
    })
}
