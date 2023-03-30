const Coupon=require('../../model/coupon/coupon')

exports.couponForm=(req,res)=>{
    res.render('coupon',{message:null})
}

exports.createCoupon=async (req,res)=>{

    try {
      const { couponCode,discountType, couponAmount,minCartAmount,minRedeemAmount,expiryDate,quantity}=req.body

      const existCoupon=await Coupon.findOne({couponCode})

      if(existCoupon){
        res.render('coupon',{message:'coupon already exist'})
        return
      }
      if(!couponCode || !discountType || !couponAmount || !minCartAmount || !minRedeemAmount || !expiryDate || !quantity){
        res.render('coupon',{message:'Please fill the all fields'})
        return
      }
      const coupon=new Coupon({
        couponCode:couponCode,
        discountType:discountType,
        couponAmount:couponAmount,
        minCartAmount:minCartAmount,
        minRedeemAmount:minRedeemAmount,
        expiryDate:expiryDate,
        quantity:quantity
      })
      await coupon.save()
      res.redirect('/admin/addcoupons')
    } catch (error) {
      console.log(error);
    }
}

exports.getAllcoupons=async (req,res)=>{

  try {
  const coupons=await Coupon.find()
  const coupon = coupons.map(coupon => {
    const formattedDate = coupon.expiryDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'numeric', year: '2-digit' });
    return { ...coupon.toObject(), expiryDate: formattedDate };
  });
  res.render('coupenList',{coupon})
  } catch (error) {
    console.log(error);
  }
}

exports.editCouponForm=async (req,res)=>{

  try {
    const coupon=await Coupon.findById({_id:req.params.id})
    res.render('editCoupon',{coupon,message:null})
  } catch (error) {
    console.log(error);
  }
  
}

exports.editCoupon=async (req,res)=>{

  try {
    const { couponCode,discountType, couponAmount,minCartAmount,minRedeemAmount,expiryDate,quantity}=req.body

    const existCoupon=await Coupon.findOne({couponCode})

   
    if(!couponCode || !discountType || !couponAmount || !minCartAmount || !minRedeemAmount || !expiryDate || !quantity){
      const coupon=await Coupon.findById({_id:req.params.id})
      res.render('editCoupon',{coupon,message:'Please fill the all fields'})
      return
    }
    await Coupon.findByIdAndUpdate({_id:req.params.id},{
      couponCode:couponCode,
      discountType:discountType,
      couponAmount:couponAmount,
      minCartAmount:minCartAmount,
      minRedeemAmount:minRedeemAmount,
      expiryDate:expiryDate,
      quantity:quantity
    })
    res.redirect('/admin/coupons')
  } catch (error) {
    console.log(error);
  }
}