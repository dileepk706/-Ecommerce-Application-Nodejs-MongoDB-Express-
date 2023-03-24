const express = require ('express');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const nocache = require('nocache');
const router = express.Router();
const category = require('../controller/admin/category')
const brand = require('../controller/admin/brand')
const product = require('../controller/admin/product')
const prdct=require('../model/product/product')
const axios = require('axios')
const userRender=require('../render/user/render');
const userHome=require('../controller/user/userHome')
const adminRender=require('../render/admin/render')
const userAccount= require('../controller/user/userLogin&logout')
const adminLogin=require('../controller/admin/login&logout')
const userMidleWare=require('../middleWares/userAuth')
const adminMidleWare=require('../middleWares/adminAuth')
const product_shoping=require('../controller/user/shoping')
const userProfile=require('../controller/user/profile')
const checkout=require('../controller/user/checkout')
const orders_and_wishlist=require('../controller/user/orderList')
const wishlist=require('../controller/user/wishList')
const user_management=require('../controller/admin/userManagement')
const orders=require('../controller/admin/orders')


// multerSetup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const imageFilter = function (req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFilter });



/*****************************************************************************************************/
                                //********************//
                               //   Render handler  //
                              //******************//
/*****************************************************************************************************/

//user+
router.get('/',userMidleWare.requireUserAuth,userRender.userhome); 
router.get('/category',userMidleWare.requireUserAuth,userRender.userCategoryHome)
router.get('/login',nocache(),userRender.userLogin)
router.get('/signup',userRender.userSignup)

//admin

router.get('/admin/dashboard',adminMidleWare.adminAuth,adminRender.adminDashbord)
router.get('/admin/view_category',adminMidleWare.adminAuth,adminRender.categoryPagerender)
router.get('/admin/category/add_category',adminMidleWare.adminAuth,adminRender.addCategory)
router.get('/admin/category/add_subcategory',adminMidleWare.adminAuth,adminRender.addSubcategory)
router.get('/admin/product/add_product',adminMidleWare.adminAuth,adminRender.addProductForm)
router.get('/admin/product_list',adminMidleWare.adminAuth,adminRender.productList)
router.get('/admin/category/add_brand',adminMidleWare.adminAuth,adminRender.addBrand)
router.get('/admin/login',adminRender.adminLoginPage)
router.get('/admin/product/updateProduct',adminRender.updateProduct)
router.get('/admin/updateCategory',adminRender.updateCategory)
router.get('/admin',(req,res)=>{
  res.redirect('/admin/login')
})
// router.get('/admin/signup',(req,res)=>{
//   res.render('adminSignup')
// })


/*****************************************************************************************************/
                                //********************//
                               //       API         //
                              //******************//
/*****************************************************************************************************/

// ADMIN
router.get('/admin/logout',adminLogin.adminLogout)
router.get('/admin/category' ,category.categoryList)
router.get('/admin/products',product.productList)
router.get('/admin/category_and_subcategory_list',category.categoryDetails)
router.get('/admin/products/edit',product.product_details)
router.get('/admin/user_management',user_management.get_all_users );
router.get('/admin/orders',orders.get_all_orders)
router.get('/admin/order',orders.order_details)

router.post('/admin/signup',(req,res)=>{res.json(' hi ')})
router.post('/admin/login',adminLogin.adminLogin)
router.post('/admin/category/add_category',upload.single('image'),category.addCategory);
router.post('/admin/category/update_category',category.addSubCategory);
router.post('/admin/category/add_brand',upload.single('image'),brand.addBrand);
router.post('/admin/product/add_product',upload.array('image'),product.addProduct);

router.put('/admin/update_category',category.updateCategory)
router.put('/admin/product/edit',product.update_product)

router.delete('/admin/category/delete',category.deleteCategory)
router.delete('/admin/category/delete_subcategory',category.deleteSubCategory)
router.delete('/admin/products/delete',product.deleteProduct)

router.patch('/admin/user_action',user_management.block_unblock_user)



//USER
router.get('/user',userMidleWare.requireUserAuth,userHome.userHome)
router.get('/logout', userAccount.userLogout)
router.get('/search',userMidleWare.requireUserAuth,userHome.getPrdctBySearch)
router.get('/filter',userMidleWare.requireUserAuth,userHome.prdctFilter)  
router.get('/sort',userMidleWare.requireUserAuth,product_shoping.product_sort)
router.get('/product_details',userMidleWare.requireUserAuth,product_shoping.product_details)
router.get('/viewcart',userMidleWare.requireUserAuth,product_shoping.show_cart)
router.get('/cart_qty',userMidleWare.requireUserAuth,product_shoping.change_qty)
router.get('/address',userMidleWare.requireUserAuth,userProfile.showAddress)
router.get('/profile',userMidleWare.requireUserAuth,userProfile.showProfile)
router.get('/checkout-address',checkout.checkout_adress)
router.get('/checkout-address-save',checkout.save_address)
router.get('/checkout-payment',checkout.checkout_payment)
router.get('/checkout-review',nocache(),checkout.checkout_review)
router.get('/checkout-complete',checkout.checkout_complete)
router.get('/myorders',orders_and_wishlist.get_all_orders)
router.get('/wishlist',wishlist.get_wishlist)
router.get('/return',orders_and_wishlist.return_order)

router.post('/add_address',userProfile.createAddress)
router.post('/signup',userAccount.userRegistration)
router.post('/login',userAccount.userlogin)

router.put('/wishlist',wishlist.add_wishlist)

router.delete('/viewcart/remove_cart',product_shoping.remove_item)
router.delete('/myorders/cancelorder',orders_and_wishlist.cancel_order)
router.delete('/wishlist/remove_allitem',wishlist.dlt_wishlist_single_item)
router.delete('/wishlist/removeitem',wishlist.clear_wishlist)

const Product=require('../model/product/product')
const Cart=require('../model/cart/cart')
const Order=require('../model/order/order')
const Category=require('../model/category/category')
const Brand=require('../model/brand/brand')
const User=require('../model/user/user')

const mongoose = require('mongoose');

router.put('/admin/status',(req,res)=>{

  const {ordId,prdctId,status}=req.body
  const qty=parseInt(req.body.qty)
  console.log('qty:'+qty);
  // console.log('order='+ordId+"product ="+prdctId+"stat ="+status);
  Order.findById({_id:ordId}).then(ord_data=>{

    if(status==='refund-approved'){
      
      Product.findById({_id:prdctId}).then(data=>{
        const changd_qty=data.quantity+qty
        data.quantity=changd_qty
        return data.save()
      }).then(data=>{
        change_stat()
      }).catch(err=>{
        console.log(err)
      })
    }else{
      change_stat()
    }
    function change_stat(){
      const prdct=ord_data.items.find(prdct_data=>prdct_data.item._id==prdctId)
    prdct.status=status
    ord_data.markModified('items')
    ord_data.save().then(data=>{
      res.json({message:'Status changed'})

    }).catch(err=>{
      console.log(err);
      res.json({message:'Somthing went wrong'})

    })
    }

  }).catch(err=>{
    console.log(err);
    res.json({message:'Somthing went wrong'})

  })
})



// const random_string=require('randomstring')

// router.get('/forgot_password',(req,res)=>{

//   res.render('forgetPassword')
// })

// router.post('/forgot_password',(req,res)=>{

//   const email=req.body.email
//   User.findOne({email:email}).then(user_data=>{
//     if(user_data){

//       const randomString=random_string.generate()
//     }else{
//       res.render('forgetPassword',({message:'Email Id is incorect'}))
//     }
//   })
//   res.send(email)
// })

















// twilio-sms

const {sendOTP,verifyOTP}=require('../controller/twilio-sms');
const { response } = require('express');
const order = require('../model/order/order');

router.get('/twilio-sms/Request_OTP',(req,res)=>{
 res.render('login_otp',{message:null})
})


router.post('/twilio-sms/send-otp',sendOTP)


router.post('/twilio-sms/verify-otp',verifyOTP)

module.exports = router