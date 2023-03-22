exports.adminAuth=(req,res,next)=>{
    // if (req.session && req.session.admin) {
    //      next();
    //   } else {
    //     res.redirect('/');
    //   }
    next()
}