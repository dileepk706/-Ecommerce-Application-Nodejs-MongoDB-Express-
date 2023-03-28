
const Product = require ('../../model/product/product');
const Category = require('../../model/category/category');
const Brand = require('../../model/brand/brand')



exports.addProduct= (req,res)=>{
  const {pname,sname, name,description,brand_name}=req.body;
  const price= parseInt(req.body.price );
  const quantity =  parseInt(req.body.quantity );
  const images = req.files.map(file => file.filename);
  const product= new Product({
      name:name,
      quantity:quantity,
      price:price,
      image:images,
      description:description,
      brand_name:brand_name,
      category:pname,
      subcategory:sname
  })
  Product.findOne({name:name}).then((foundPrdct=>{
      if(foundPrdct){
          let qnty = foundPrdct.quantity
          qnty += 1
          Product.findOneAndUpdate({name:name},{quantity:qnty}).then(updatedPrdct=>{
              return res.status(301).send({message:`the product is already exist...So the quantity is updated by ${1}`})
          })
      }else{
          Brand.findOne({name:brand_name}).then(foundBrand=>{
              if(!foundBrand){
                  return res.status(301).send({message:'cant find the barnd...please add the brand frist'})
              }else{
                  foundBrand.products.push(product._id)
                  foundBrand.save().then().catch(err=>{ return res.status(401).send({message:'somthing went wrong'})})
                  let foundSubcategory=null
                  Category.findOne({name:pname}).then(category=>{
                    if(!category){
                      res.status(301).send({message:'no category'})
                      return
                    }else{
                      for(let subCategory of category.subcategories){
                        if(subCategory.name==sname){
                          foundSubcategory = subCategory
                          break
                        }
                      }
                    }
                    if(!foundSubcategory){
                      res.status(404).send({message:'cant find the subcategory'})
                      return
                    }else{
                      foundSubcategory.products.push(product._id)
                      product.save().then().catch(err=> res.status(401).send('somthing went wrong when save the product'))
                      category.save().then(result=>{
                            res.status(200).send({message:'product added '})
                          }).catch(err=>{
                            res.status(401).send({message:'error while save the product'+err})
                          })
                    }
                  }).catch(err=>{
                      res.status(403).send({message:'somthing went wrong' + err})
                  })
              }
          }).catch(err=>{
              return res.status(301).send({message:'somthing went wrong' + err})
          })
      }
  })).catch(err=>{ if (error instanceof multer.MulterError) {
    // handle multer errors
    return res.status(400).json({ message: error.message });
  } else {
    // handle other errors
    return res.status(500).json({ message: 'something went wrong' });
  }
      return res.status(501).send({message:'something went wrong' + err})
  })

}

exports.productList=(req,res)=>{

  Product.find({isDeleted:false}).then(
   products=>{
     res.status(200).send(products)
   }
  ).catch(
   err=>{
     res.status(401).send({messege: 'somthing went wrong '+ err})
   }
  )
 
}

exports.deleteProduct=(req,res)=>{
  const _id=req.query.id
  console.log(_id);
  Product.findByIdAndUpdate({_id},{isDeleted:true}).then(result=>{
    if(!result){
      return res.status(404).json({message:'somthing went wrong while delete the product'})
    }
    return res.status(200).json({message:'Product Deleted succefully'})
  }).catch(err=>{
    return res.status(501).json({mesaage:'somthing went wrong   '+err})
  })
}

exports.product_details=(req,res)=>{
  const id= req.query.id
  Product.findById({_id:id}).then(productData=>{
    if(!productData){
      return res.status(404).json({message:'product not found'})
    }
    res.status(200).json(productData)
  }).catch(err=>{
    res.status(500).json({message:'somthing went wrong!!!'})
  })
}

exports.update_product=(req,res)=>{
  const {name,description,price,quantity,id}=req.body
  Product.findByIdAndUpdate({_id:id},{
    name:name,
    description:description,
    price:price,
    quantity:quantity
  }).then(data=>{
    res.status(200).json({message:'Product updated succefully'})
  }).catch(err=>{
    console.log(err);
    res.status(500).json(err)
  })
}