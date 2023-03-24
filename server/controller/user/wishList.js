const User=require('../../model/user/user')
const Product=require('../../model/product/product')

exports.get_wishlist=(req,res)=>{
    const _id = req.session.user;
  
    User.findById({ _id: _id }).populate('wishlist') 
      .then(data => {
        const sortedWishlist = data.wishlist.sort((a, b) => b._id - a._id);
        res.render('wishlist', { data: { wishlist: sortedWishlist } });
      });
    
  }

exports.add_wishlist=(req,res)=>{
    const _id=req.session.user
    const product_id=req.query.prdctId
    Product.findById({_id:product_id}).then(product=>{
      return User.findByIdAndUpdate({_id},{$addToSet:{wishlist:product._id}})
    })
    .then(data=>{
      res.json({message:'product added into wishlist'})
    })
    .catch(err=>{
      res.json({message:'somthing went wrong'})
    })
  }

exports.dlt_wishlist_single_item=(req,res)=>{
    const _id=req.session.user
  
    User.findByIdAndUpdate({_id:_id},{$unset:{wishlist:[]}}).then(data=>{
      res.json({message:'your wishlist is cleared!'})
    }).catch(err=>{
  console.log(err);
      res.json({message:'somthing went wrong'})
    })
  }

exports.clear_wishlist=(req,res)=>{

    const _id=req.session.user
    const prdctId=req.query.prdctId
  
  
    User.findByIdAndUpdate({_id:_id},{$pull:{wishlist:prdctId}}).then(data=>{
      res.json({message:'Product removed from the wishlist'})
    }).catch(err=>{
  
      res.json({message:'somthing went wrong!'})
    })
  }