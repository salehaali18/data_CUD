const express=require('express');

const {check,body}=require('express-validator/check');


const routes=express.Router();
const UserControl=require('../controllers/userControl');
routes.get('/',UserControl.getHomePage);
routes.get('/login',UserControl.getLoginPage);
routes.get('/register',UserControl.getRegisterPage);
routes.get('/resetpage',UserControl.getResetPage);
routes.get('/newpasspage/:token',UserControl.getnewpasspage);
  
routes.post('/loginform',[check('email').normalizeEmail().isEmail().withMessage('email should be valid'),
body('password','password must be 6 digits')
.isLength({min:6}).isAlphanumeric().trim()],UserControl.postLoginUser);

routes.post('/registerform',[check('name')
.isLength({min:3,max:15})
.withMessage('name should not be less then 3'),
check('phone').isLength({min:10}).withMessage('phone number should be 10 digits'), //.isMobilePhone(['en-IN'],{withMessage:'Phone number must be valid'})
check('email').normalizeEmail().isEmail().withMessage('email should valid'),
body('password','password must be 6 digits')
.isLength({min:6}).isAlphanumeric().trim()]
,UserControl.postRegisterUser);

routes.post('/passwordreset',UserControl.postPasswordReset);
routes.post('/newupdatepass',UserControl.postUpdatePass);
// routes.get('/dashboard',UserControl.getDashboard);
routes.post('/update',UserControl.postUpdate);
routes.get('/edit/:id',UserControl.getedit);
routes.get('/delete/:id',UserControl.deleteDetails);
routes.post('/logout',UserControl.postLogout);
module.exports=routes;