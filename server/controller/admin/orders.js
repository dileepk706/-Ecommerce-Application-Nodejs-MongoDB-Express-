const Order=require('../../model/order/order')
const Product=require('../../model/product/product')

exports.get_all_orders=(req,res)=>{

    Order.find({}).sort({createdAt:-1}).then(order=>{
      res.render('orderList',{order})
    }).catch(err=>{
      console.log(err);
      
    })
    
  }

exports.order_details=(req,res)=>{
    const {prdctId,ordId}=req.query
  
    Order.findById({_id:ordId}).then(order=>{
  
      const order_prdct=order.items.find(ord_prdct=> ord_prdct.item._id==prdctId)
  
      Product.findById({_id:prdctId},{name:1,price:1,_id:1}).then(product=>{
  
        res.render('order',{order,order_prdct,product})
  
      })
    }).catch(err=>{
        console.log(err)
    })
  }