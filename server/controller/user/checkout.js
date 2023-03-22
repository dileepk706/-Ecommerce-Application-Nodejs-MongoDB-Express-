const Product=require('../../model/product/product')
const Cart=require('../../model/cart/cart')
const Order=require('../../model/order/order')
const User=require('../../model/user/user')

exports.checkout_adress=(req,res)=>{
    const userId=req.session.user
      User.findById({_id:userId}).then(userData=>{
        const address=userData.address
        Cart.findOne({user_id:userId}).populate('product.item').then(cartData=>{
          if(cartData.product.length>0){
            return res.render('shop-checkout-address',{userData,address,cartData})
          }else{
            return res.redirect('/viewcart')
          }
        })
      })
  }

exports.save_address=(req,res)=>{
  
    req.session.userAddress =req.query.address
    res.json({message:'address saved'})
  
  }

exports.checkout_payment=(req,res)=>{

    const userId=req.session.user
    Cart.findOne({user_id:userId}).populate('product.item').then(cartData=>{
      res.render('checkout-payment',{cartData})
    })
     
  }

exports.checkout_review=(req,res)=>{
  
    if(req.session.userAddress){
      const userId=req.session.user
      const method=req.query.method
      console.log(method);
      Cart.findOne({user_id:userId}).populate('product.item').then(cartData=>{
        res.render('checkout-review',{cartData,method})
      })
    }else{
      res.send('<center> <h1>the order is placed </h1> <br><a href="/"><button>Back to home</button></a> </center>')
    }
   
  }

exports.checkout_complete=(req,res)=>{

    const method=req.query.method
    const address=req.session.userAddress
    const userId=req.session.user
    
        // Prefix for the order ID
      const ORDER_ID_PREFIX = "ORD";
  
      // Function to generate a unique order ID
      function generateOrderId() {
        const timestamp = new Date().getTime();
        const randomNum = Math.floor(Math.random() * 1000);
        const orderId = `${ORDER_ID_PREFIX}-${timestamp}-${randomNum}`;
        return orderId;
      }
  
    Cart.findOne({user_id:userId}).populate('product.item').then(cartData=>{
  
      const orderId = generateOrderId();
  
      const newOrder= new Order({
        user:cartData.user_id,
        orderId:orderId,
        items:cartData.product ,
        shippingAddress:address,
        paymentMethod:method,
        total_amount:cartData.total_amount
      })
  
      newOrder.save()
      .then(new_order=>{
        cartData.product.forEach(product=>{
          const newPrdctQty=product.item.quantity-product.quantity
          Product.findByIdAndUpdate({_id:product.item._id},{quantity:newPrdctQty}).then().catch(err=>{return res.send(err);})
        })
        Cart.findOneAndDelete({_id: cartData._id})
        .then(deletedDoc => {
          req.session.userAddress=null
          return res.render('checkout-complete',{new_order,cartData,address})
          })
        }).catch(err=>{
          return res.send('error'+err);
        })
      })
    .catch(err=>{
      return res.send(err)
    })
  
  }
