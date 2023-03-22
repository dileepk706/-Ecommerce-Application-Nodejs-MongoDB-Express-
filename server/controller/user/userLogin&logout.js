const USER = require('../../model/user/user')
const CART = require('../../model/cart/cart');
const bcrypt = require('bcrypt');



exports.userRegistration= (req,res)=>{
    const { name,email,phone,password}=req.body
    USER.findOne({email:email}).then(foundUser=>{
      if(foundUser){
        res.status(301).send({message:'the E-mail was already registerd'})
      }else{
     
        
       bcrypt.hash(password, 10).then(hashPassword=>{
        const user= new USER({
            name:name,
            email:email,  
            phone:phone,
            password:hashPassword,
            wishlist:[]
          })
        const cart= new CART({
          user_id:user._id,
          total_amount:0,
          product:[]
        })
          user.save().then(data=>{
            return cart.save()
          }).then(data=>{
            res.redirect('/login')
          })
          .catch(err=>{
            res.status(401).send({message : 'somthing went wrong...'+err})
          })
       });
      }
    })
  }

exports.userlogin=(req,res)=>{
  const {email,password}=req.body;
  // console.log(email+' '+password);
  USER.findOne({email:email}).then(userData=>{
    if(!userData){
      return res.status(300).json({message:'the user does not exist'})
      // return res.render('UserLoginPage',{message:'you dont have Account in shopSmart... please create a Account first',passwordError:null})
    } 
    bcrypt.compare(password, userData.password).then(match=>{
      if(!match){
        return res.status(300).json({message:'password is not correct'})
        // return res.status(304).json({message:'Please enter Correct password'})
        // return res.render('UserLoginPage',{message:'Please enter Correct password',userNotFound:null})
      }
      if(userData.status===false){
      return res.status(300).json({message:'Your account has Banned by the admin!'})
      }
      req.session.user=userData._id
      // console.log(req.session.user);
      return res.status(200).json({message:'successfully loged in'})
    }).catch(err=>{

      // return res.status(304).json({message:'Please enter Correct password'})
    })
  })
}

exports.userLogout=(req,res)=>{
   if (req.session && req.session.user) {
    // Destroy the user's session
    req.session.user = null;
    res.redirect('/login');
  } else {
    res.redirect('/login');
  }
}


// const ADMIN=require('../../model/admin/admin')

// exports.adminRegistration= (req,res)=>{
//   const { name,email,phone,password}=req.body
//   ADMIN.findOne({email:email}).then(foundUser=>{
//     if(foundUser){
//       res.status(301).send({message:'the E-mail was already registerd'})
//     }else{
     
      
//      bcrypt.hash(password, 10).then(hashPassword=>{
//       const admin= new ADMIN({
//           name:name,
//           email:email,  
//           phone:phone,
//           password:hashPassword,
//         })
//         admin.save().then(data=>{
//           res.redirect('/login')
//         })
//         .catch(err=>{
//           res.status(401).send({message : 'somthing went wrong...'+err})
//         })
//      });
//     }
//   })
// }

