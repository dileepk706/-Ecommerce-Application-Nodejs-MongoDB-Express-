const Order=require('../../model/order/order')

exports.get_all_orders=(req,res)=>{
    const user_id=req.session.user
    Order.find({user:user_id})
    .populate({
      path: 'items.item',
      model: 'product'
    })
    .then((orders)=> {
      res.render('myOrders',{orders})
    }).catch(err=>{
      console.log(err);
    })
  
    // Order.aggregate([
    //   {
    //     $match:{user:mongoose.Types.ObjectId(user_id)},
    //   },
    //   {
    //     $lookup:{
    //       from:"products",
    //       localField:"items.item",
    //       foreignField:"_id",
    //       as:"products"
    //     }
    //   },
    //   {
    //     $project:{
    //       status:1,
    //       items:1,
    //       products:{
    //         name: 1,
    //         price: 1,
    //         image: 1
    //       }
    //     }
    //   }
    // ]).then(orderList=>{
      
    //   orderList.forEach(element => {
    //     element.products.forEach(d=>{
    //       console.log(d)
    //     })
    //     ;
    //   });
    //   res.render('myOrders',{orderList})
    // })
    
  }

  exports.cancel_order=(req,res)=>{

    const product_id=req.query.prdctId
    const ORD_id=req.query.ordId
  
    Order.findOne({orderId:ORD_id}).then(orderData=>{
      const prdctStat=orderData.items.find(data=> data.item._id==product_id)
      prdctStat.status="cancelled"
      orderData.markModified('items')
      return orderData.save()
    })
    .then(savedStatus=>{
      res.json({message:'Order Cancelled!'})
    })
    .catch(err=>{
      res.json({message:err})
    })
  
  }

exports.return_order=(req,res)=>{
  const {order_id,product_id}=req.query 
  console.log(`orderid=${order_id} prodv=${product_id}`);

  Order.findById({_id:order_id}).then(order_data=>{

    let product=order_data.items.find(prdct=> prdct.item._id==product_id)
    console.log(product);
    product.status="return"
    order_data.markModified('items')
    return order_data.save().then(data=>{
      console.log('hi'+data);
      res.json({message:'Return request has gone to Admin'})
    }).catch(err=>{
      res.json({message:'somthing went wrong'})
    })

  })

}