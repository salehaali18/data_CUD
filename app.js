const express=require('express');
const app=express();
const body_parser=require('body-parser');
const path=require('path');

const multer=require('multer');
const mongoose=require('mongoose');
const session=require('express-session');
const UserModel=require('./models/userModel');
const express_flash=require('express-flash');

const csrf=require('csurf');//cross site request forgery 
const mongoStore=require('connect-mongodb-session')(session);
const uri='mongodb+srv://saleha:saleha186228@education-1wyjj.mongodb.net/NewLoginDetail';

//api key             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

const session_store=new mongoStore({
    uri:uri,
    collection:'session'
})
const userRoute=require('./routes/User_routes');
const adminRoutes=require('./routes/admin_route');


const csrfprotect=csrf();

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }


}

const fileStorage = multer.diskStorage({

    destination:(req,file,cb)=>{
        cb(null,'images');
    },
    filename:(req,file,cb)=>{
        cb(null,new Date().toISOString().replace(/:/, '-')+ '-'+ file.originalname);
    }

})


app.use(body_parser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));
app.use('/images',express.static(path.join(__dirname,'images')));

app.use(multer({storage:fileStorage ,fileFilter:fileFilter}).single('image'));

app.use(session({
    secret:"usersaleha",
    resave:false,
    saveUninitialized:false,
    store:session_store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 1
        //1000 * 60 * 60 * 24 * 1 // 1 day
      },
}))

app.use(csrfprotect);



app.use((req, res, next) => {
    if (!req.session.login_admin_data) {
        return next();
    }
    UserModel.findById(req.session.login_admin_data._id)
        .then(admin => {
            req.admin = admin;
            next();
        })
        .catch(err => console.log(err));
});




app.use((req,res,next)=>{
    res.locals.csrftoken=req.csrfToken();
    next();
})
app.set('view engine','ejs');
app.set('views','views');

app.use(userRoute);
app.use(adminRoutes);
app.use(express_flash());

app.use((req,res,next)=>{
    res.status(200).send('PAGE NOT FOUND');
})
mongoose.connect(uri,{ useNewUrlParser: true })
.then(result=>{
    app.listen(1010,()=>{
        console.log('server is running at port 1010');
    })
}).catch(err=>{
    console.log(err);
})
