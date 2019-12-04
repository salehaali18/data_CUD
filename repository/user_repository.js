const userModel=require('../models/userModel');
const bcrypt=require('bcryptjs');

class UserDetails{
constructor(name,phone,email,password){
this.name=name;
this.phone=phone;
this.email=email;
this.password=password;
}
saveUser(){
    const User=new userModel({
        name:this.name,
        phone:this.phone,
        email:this.email,
        password: this.password

    })
    return User.save()
    .then(result=>{
        return result;
    })
    .catch(err=>{
        console.log(err);
    })
}

static hashpassword(password,hashpass){
    return bcrypt.compare(password ,hashpass)
    .then(domatch=>{
        return domatch;
    })
    .catch(err=>{
        console.log(err);
    })

}




}
module.exports = UserDetails;