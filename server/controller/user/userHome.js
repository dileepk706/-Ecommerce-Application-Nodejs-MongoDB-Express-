const CATEGORY=require('../../model/category/category');
const Product=require('../../model/product/product')

exports.userHome=async(req,res)=>{
        const categories= await CATEGORY.find({isDeleted:false})
        CATEGORY.findOne({name:'Electronics'}).populate('subcategories.products').then(data=>{
            if(!data){
                res.send('no data')
                return
            }else{
                const mobileCategory=data.subcategories.find(subcategory=>
                    subcategory.name=='Mobiles' 
                    )
                let mobiles=mobileCategory.products.slice(0,7)
                const headphonesCategory=data.subcategories.find(subcategory=>
                    subcategory.name=='Headphones'
                    )
                let headphones=headphonesCategory.products
                // res.status(200).send({category,mobiles,headphones})
                res.render('userHmome', { categories,mobiles,headphones});
            }
        }).catch(err=>{
            res.send(err)
        })
}

exports.getPrdctBySearch=(req,res)=>{

  if(req.query.search){
    req.session.searchVal=req.query.search
  }
    

  //asigning the search value into the session for accesing 
  var payload= req.session.searchVal
   
  
  let error=null
  let minPrice
  let maxPrice
  const regex = new RegExp(`(^${payload}|\\..*\\b${payload}\\b.*\\.)`, 'i');
  CATEGORY.findOne( {name: { $regex: regex } }).populate('subcategories.products').then(p_products=>{
    if(p_products){
      // res.send(p_products)
     const  SubCatproducts=null
     const products=null
       res.render('shoping_page',{maxPrice,minPrice,p_products,SubCatproducts,products,error})
      return
    }
     CATEGORY.find().populate('subcategories.products').then(s_products=>{
     for(let category of s_products){
      const SubCatproducts=category.subcategories.find(subcat=>
        subcat.name==payload,  
        )
        if(SubCatproducts){
          //  res.send(SubCatproducts) 
          const products=null
           res.render('shoping_page',{maxPrice,minPrice,p_products,SubCatproducts,products,error})
           return
          break;
        }
     }


        const limit=3
        let page=1
        if(req.query.page){
          page=req.query.page
        console.log(page);

        }

     
       Product.find({name: { $regex: regex } }).skip((page-1)*limit).limit(limit*1)
       .then(products=>{
        
        Product.find({name: { $regex: regex } }).countDocuments().then(totalpage=>{
          const totalPage=Math.ceil(totalpage/limit)
          if(products.length>0){
            const SubCatproducts=null
    
            
            res.render('shoping_page',{maxPrice,minPrice,p_products,SubCatproducts,products,error,totalPage})
          // res.render('shopProductList',{maxPrice,minPrice,p_products,SubCatproducts,products,error})
    
            return
          }
          const SubCatproducts=null
          error=true
          res.render('shoping_page',{maxPrice,minPrice,p_products,SubCatproducts,products,error})

        })
        
      
     })

    })
    
  })
  .catch(err=>{
    res.send(err)
  })
}

exports.prdctFilter=(req,res)=>{

    let p_products=null
    let SubCatproducts=null
    let error=null
    
    const productQuery=req.session.searchVal;
    console.log(productQuery);
    let price_above= req.query.Price_above
    let price_below=req.query.price_below
    req.session.maxPrice=price_above
    req.session.minPrice=price_below
    const regex = new RegExp(`(^${productQuery}|\\..*\\b${productQuery}\\b.*\\.)`, 'i');
    if(price_above){
        let maxPrice=price_above
        let minPrice
        Product.find({$and: [{ name: { $regex: regex}  },{ price: { $gt: price_above } }]}  ).then(products => {
            console.log(products);
            return res.render('shoping_page',{maxPrice,minPrice,p_products,SubCatproducts,products,error});
          })
          .catch(err => {
            console.error(err);
            return res.status(500).send('Server Error');
          });
    }
    if(price_below){
        let minPrice=price_below
        let maxPrice
        Product.find({$and: [{ name: { $regex: regex}  },{ price: { $lt: price_below } }]}  ).then(products => {
            console.log(products);
            res.render('shoping_page',{maxPrice,minPrice,p_products,SubCatproducts,products,error});
          })
          .catch(err => {
            console.error(err);
            res.status(500).send('Server Error');
          });
    }
   
  }