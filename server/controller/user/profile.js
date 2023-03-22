const Product=require('../../model/product/product')
const Category=require('../../model/category/category')
const Brand=require('../../model/brand/brand')
const Cart=require('../../model/cart/cart')
const User=require('../../model/user/user')

exports.showProfile=(req,res)=>{

    const userId=req.session.user
    User.findById({_id:userId}).then(userData=>{
      // console.log(userData);
      res.render('userProfile',{userData})
  
    })
}

exports.showAddress=(req,res)=>{

    const userId=req.session.user
    User.findById({_id:userId}).then(userData=>{
  
      const address=userData.address
  
      res.render('userAddress',{userData,address})
  
    })
}

exports.createAddress=(req,res)=>{

  const{name ,phone  ,address ,pincode ,state ,city}=req.body
  const userId=req.session.user
  const checkout=req.body.checkout
  const newAddress = {
    name: name,
    phone: phone,
    pincode: pincode ,
    address :address,
    city:city,
    state:state ,
  };
  User.findById({_id:userId}).then(userData=>{
    userData.address.push(newAddress)
    return userData.save()
  }).then(save=>{
    if(req.body.checkout){
      res.redirect('/checkout-address')
    }else{
      res.redirect('/address')
    }
  }).catch(err=>{
    console.log(err);
    res.send(err)
      })

  }

