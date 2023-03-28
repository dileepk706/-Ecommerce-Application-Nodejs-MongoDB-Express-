const Product=require('../../model/product/product')
const Category=require('../../model/category/category')
const Brand=require('../../model/brand/brand')
const Cart=require('../../model/cart/cart')

exports.product_sort=(req,res)=>{
  
    const maxPrice = price_above=req.session.maxPrice
    const minPrice=price_below=req.session.minPrice
    const sort=req.query.sort
    const productQuery=req.session.searchVal
  
    // console.log(price_above );
    // console.log(price_below );
  
    // console.log(productQuery);
    let {p_products,SubCatproducts,error}=0
    const regex = new RegExp(`(^${productQuery}|\\..*\\b${productQuery}\\b.*\\.)`, 'i');
  if(price_above){
    Product.find({$and: [{ name: { $regex: regex}  },{ price: { $gt: price_above } }]}  ).sort({ price: sort}).then(products => {
      console.log(products);
      return res.render('cart_page',{maxPrice,minPrice,p_products,SubCatproducts,products,error});
    })
    .catch(err => {
      console.error(err);
      return res.status(500).send('Server Error');
    });
  
  
  }
  if(price_below){
    Product.find({$and: [{ name: { $regex: regex}  },{ price: { $gt: price_below } }]}  ).sort({ price: sort}).then(products => {
      return res.render('shoping_page',{maxPrice,minPrice,p_products,SubCatproducts,products,error});
    })
    .catch(err => {
      console.error(err);
      return res.status(500).send('Server Error');
    });
  }
  if(!price_above&& !price_below){
    Product.find({name:{$regex:regex}}).sort({ price: sort}).then(products => {
      return res.render('shoping_page',{maxPrice,minPrice,p_products,SubCatproducts,products,error});
    })
    .catch(err => {
      console.error(err);
      return res.status(500).send('Server Error');
    });
  }
  
}

  exports.product_details=(req,res)=>{

    const id=req.query.id
    Product.findOne({_id:id}).then(product=>{
      // console.log(product);
      res.render('product_detail',{product})
    })
  }

exports.show_cart=(req,res)=>{

    const prdct_id=req.query.product
    const user_id=req.session.user
  
    // console.log(user_id);

    Cart.findOne({user_id:user_id})
    .then(foundCart=>{
      if(!foundCart){

        const newCart=new Cart({
          user_id:user_id,
          product:[],
          total_amount:0
        })
        newCart.save()
        .then(cartSaaved=>{
          viewCart()
          return
        })
      }else{
        viewCart()
      }
    })
  
  function viewCart(){

      if(!prdct_id){
        Cart.findOne({user_id:user_id}).populate('product.item').then(cartData=>{
          res.render('shop-cart',{cartData})
          return
        })
    
      }else{
    
    //find the product for get the product object _id
    Product.findById({_id:prdct_id}).then(productData=>{
    
      //find the cart
      Cart.findOne({user_id:user_id}).populate('product.item').then(cartData=>{
        
        //check the product is already exist in the cart
        let foundPrdctId=null
        let foundProduct=null
        for(let prdct of cartData.product ){
          if(prdct.item._id==prdct_id){
            foundPrdctId=prdct.item._id
            foundProduct=prdct
            break;
          }
        }
        
        //if the  product not foud push the product details into the product array 
        if(!foundPrdctId){
          const qty=productData.quantity<=0?0:1
          const productPrice=qty>=1?productData.price:0
          const newItem={
            item:productData._id,
            quantity:qty,
            sub_total:productPrice
          }
    
          cartData.total_amount += productPrice
          cartData.product.push(newItem )
    
          cartData.save().then(response=>{
            Cart.findOne({user_id:user_id}).populate('product.item').then(cartData=>{
    
              res.render('shop-cart',{cartData})
    
            }).catch(err=> console.log(err))
          })
         
        }else{
          res.render('shop-cart',{cartData})
        }
      })
    }) 
    .catch(err=>{
      res.send(err)
    })
    
    }
  }
}
  
exports.change_qty=(req,res)=>{
  
    const prdctId=req.query.prdctId
    const val=parseInt(req.query.val)
    const user_id=req.session.user
    const productQty=req.query.productQty
  
     
      //f/ind the cart
      Cart.findOne({user_id:user_id}).populate('product.item').then(cartData=>{
        //check the product is already exist in the cart
        let foundProduct=null
        for(let prdct of cartData.product ){
          if(prdct.item._id==prdctId){
            // foundPrdctId=prdct.item._id
            foundProduct=prdct
            break;
          }
        }


        let qty=foundProduct.quantity+val<1?1:foundProduct.quantity+val
        qty= qty>=productQty?productQty:qty
        const prodctPrice=req.query.price
        const sub_total=qty*prodctPrice
  
        // console.log('sub'+sub_total);
        foundProduct.sub_total=sub_total
        foundProduct.quantity=qty
        
        cartData.save().then(response=>{
          // response.product.it
          let total =0
          cartData.product.forEach(amnt=> {
            total +=amnt.sub_total 
            // console.log(total+' '+amnt.sub_total);
          })
          // console.log('tottal='+total);
          cartData.total_amount=total
          cartData.save().then(response=>{
            res.json({qty,sub_total,total})
            return
          })
          
        })
    })
    .catch(err=>{
      console.log(err);
    })

  }

exports.remove_item=(req,res)=>{

  const user_id=req.session.user
  const product_id=req.query.id

  Cart.findOne({user_id:user_id}).then(cartData=>{

    const product = cartData.product.find(prdctId=> prdctId.item==product_id)
    const subtotal=product.sub_total
    Cart.updateOne({user_id:user_id},{$pull:{product:{item:product_id}}}).then(cartDltItm=>{

      const newCartTotal=cartData.total_amount-subtotal
      cartData.total_amount=newCartTotal
      cartData.save().then(updateTotal=>{
        res.send({cartDltItm,updateTotal})
      })
    })
  }).catch(err=>{
    res.send(err)
  })

}

