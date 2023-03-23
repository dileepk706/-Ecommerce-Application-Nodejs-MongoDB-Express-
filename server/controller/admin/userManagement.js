const User=require('../../model/user/user')

exports. get_all_users=(req, res) => {
    User.find({}, {name: 1, email: 1, status: 1, _id: 1, createdAt: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } } }).then(userData => {
      res.render('userManagement',{userData});
    }).catch(err => {
      res.send({ message: err });
      console.log(err);
    });
  }


exports.block_unblock_user=(req,res)=>{

    const {action,_id}=req.query
    if(action==0){
      User.findByIdAndUpdate({_id},{status:false})
      .then(data=>{
        res.json({message:'Blocked the User'})
      }).catch(err=>{
        res.json({message:'somthing went wrong'})
      })
    }
    if(action==1){
      User.findByIdAndUpdate({_id},{status:true})
      .then(data=>{
        res.json({message:'Unblocked the user'})
      }).catch(err=>{
        res.json({message:'somthing went wrong'})
      })
    }
  }