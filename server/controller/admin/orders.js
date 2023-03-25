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

exports.change_status=(req,res)=>{

  const {ordId,prdctId,status}=req.body
  const qty=parseInt(req.body.qty)
  console.log('qty:'+qty);
  // console.log('order='+ordId+"product ="+prdctId+"stat ="+status);
  Order.findById({_id:ordId}).then(ord_data=>{

    if(status==='refund-approved'){
      
      Product.findById({_id:prdctId}).then(data=>{
        const changd_qty=data.quantity+qty
        data.quantity=changd_qty
        return data.save()
      }).then(data=>{
        change_stat()
      }).catch(err=>{
        console.log(err)
      })
    }else{
      change_stat()
    }
    function change_stat(){
    const prdct=ord_data.items.find(prdct_data=>prdct_data.item._id==prdctId)
    prdct.status=status
    ord_data.markModified('items')
    ord_data.save().then(data=>{
      res.json({message:'Status changed'})

    }).catch(err=>{
      console.log(err);
      res.json({message:'Somthing went wrong'})

    })
    }

  }).catch(err=>{
    console.log(err);
    res.json({message:'Somthing went wrong'})

  })
}