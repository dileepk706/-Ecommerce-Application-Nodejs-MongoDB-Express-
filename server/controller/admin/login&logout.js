const ADMIN=require('../../model/admin/admin');
const bcrypt = require('bcrypt');

exports.adminLogin=(req,res)=>{
const {email,password}=req.body;
    ADMIN.findOne({email}).then(adminData=>{
      if(!adminData){
        return res.render('adminLoginPage',{message:'The User is not exist'})
      }
      bcrypt.compare(password, adminData.password).then(match=>{
        if(!match){
          return res.render('adminLoginPage',{message:'Please enter Correct password'})
        }
        req.session.admin=adminData._id
        console.log(req.session.admin);
        return res.redirect('/admin/dashboard')
      })
    })
  }

  exports.adminLogout=(req,res)=>{
    if (req.session && req.session.admin) {
      // Destroy the user's session
      req.session.admin = null;
      req.session.destroy
      res.redirect('/admin/login');
    } else {
      res.redirect('/admin/login');
    }
  }
  