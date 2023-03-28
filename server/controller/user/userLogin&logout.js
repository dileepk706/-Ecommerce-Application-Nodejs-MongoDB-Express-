const User = require('../../model/user/user')
const Cart = require('../../model/cart/cart');
const bcrypt = require('bcrypt');
const random_string=require('randomstring')
const nodemailer=require('../../controller/nodemailer')


exports.userRegistration= (req,res)=>{
    const { name,email,phone,password}=req.body
    User.findOne({email:email}).then(foundUser=>{
      if(foundUser){
        res.status(301).send({message:'the E-mail was already registerd'})
      }else{
     
        
       bcrypt.hash(password, 10).then(hashPassword=>{
        const user= new User({
            name:name,
            email:email,  
            phone:phone,
            password:hashPassword,
            wishlist:[]
          })
        const cart= new Cart({
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
  User.findOne({email:email}).then(userData=>{
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

exports.forgot_page=(req,res)=>{
  res.render('forgetPassword',{message:null})
}

exports.token_send=async (req,res)=>{

  const email=req.body.email
  
  // Send the password reset email to the user's email address
  try {

    const user= await User.findOne({email:email});
    if(!user){
      res.render('forgetPassword',{message:'User not found'})
    }
    const token=random_string.generate()
    user.resetPasswordToken =token
    user.resetPasswordExpires = Date.now() + 90000;
    await user.save()

    const mailOptions = {
      from: 'dlpkmr706@gmail.com',
      to: email,
      subject: 'Password reset request',
      text:`Hi ${user.name},\n\nYou are receiving this email because you (or someone else) has requested a password reset for your account.\n\nPlease click on the following link, or paste it into your browser to complete the process:\n\nhttp://localhost:3000/reset-password?token=${token}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n\nBest,\nYour shopSMART Team`,
    };
    await  nodemailer.transporter.sendMail(mailOptions)

    return res.render('forgetPassword',{ message: `Password reset email sented at ${email}` });

  } catch (error) {
    console.log(error);
    
  }
}

exports.reset_page=async (req,res)=>{
  const token=req.query.token
  const user= await User.findOne({resetPasswordToken:token,resetPasswordExpires: { $gt: new Date() }},{resetPasswordToken:1,resetPasswordExpires:1})
  
  res.render('passwordreset',{message:null,token})

}

exports.pass_reset=async (req,res)=>{
  const {token,password}=req.body;
  console.log(token+' here '+password);
  const user= await User.findOne({resetPasswordToken:token,resetPasswordExpires: { $gt: new Date() }},{resetPasswordToken:1,resetPasswordExpires:1})
  if(!user){
    res.render('passwordreset',{token,message:'Invalid or expired token'})
    return
 }
      
 const hash_password= await bcrypt.hash(password, 10) 
 user.password=hash_password
 user.resetPasswordExpires=null
 user.resetPasswordToken=null
 await user.save()
 res.render('passwordreset',{token,message:'New password created successfully'})
 return 
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

