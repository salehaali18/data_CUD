const express=require('express');

const router=express.Router();
const admincontrol=require('../controllers/admin_control');
const authCheck = require('../middleware/auth');
router.get('/dashboard',authCheck,admincontrol.getDashboard);
router.get('/new_book',authCheck,admincontrol.getNewDashboard);
router.get('/add_book',authCheck,admincontrol.getAddBook);

router.post('/book_save',authCheck,admincontrol.postAddbook);
router.post('/book_update',authCheck,admincontrol.postUpdatebook);
 router.get('/book_details/:id',authCheck,admincontrol.getBook);
router.get('/edit_book/:id',authCheck,admincontrol.getEditableValue);
 router.get('/delete_book/:id',authCheck,admincontrol.deleteDetails);
module.exports=router;