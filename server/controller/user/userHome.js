const Category=require('../../model/category/category');
const Product=require('../../model/product/product')
const Brand=require('../../model/brand/brand')
const Banner=require('../../model/banner/banner')
exports.userHome=async(req,res)=>{

  try {
    const categories= await Category.find({isDeleted:false})
        const banner=await Banner.find() 
          
        const mobiles=await Product.find({isDeleted:false,subcategory:'mobiles'}).limit(5)
        const headphones=await Product.find({isDeleted:false,brand_name:'Apple'}).limit(5)

        // res.render('userHmome', { categories,mobiles,headphones:null,banner});
        res.render('homePage', { categories,mobiles,headphones,banner});
  } catch (error) {
    console.log(error);
  }
        

        
}
exports.getPrdctBySearch=async (req,res)=>{

  let { 
    page = 1,
    sort
  } = req.query;

  if(req.query.search){
    req.session.search=req.query.search
    req.session.category=null
    req.session.minPrice=null
    req.session.maxPrice=null
    req.session.brand=null
    req.session.superCategory=null
  }
  if(req.query.category){
    req.session.category=req.query.category
    req.session.search=null
    req.session.minPrice=null
    req.session.maxPrice=null
    req.session.brand=null
    req.session.superCategory=null
  }
  if(req.query.brand){
    req.session.brand=req.query.brand
    req.session.category=null
    req.session.search=null
    req.session.minPrice=null
    req.session.maxPrice=null
    req.session.superCategory=null
  }
  if(req.query.superCategory){
    req.session.superCategory=req.query.superCategory
    req.session.category=null
    req.session.search=null
    req.session.brand=null
    req.session.minPrice=null
    req.session.maxPrice=null
  }
  if(req.query.maxPrice){
    req.session.maxPrice=req.query.maxPrice
    req.session.minPrice=null
  }
  if(req.query.minPrice){
    req.session.minPrice=req.query.minPrice
    req.session.maxPrice=null
  }

  const sortCondition = (() => {
    switch (sort) {
      case 'price_asc':
        return { price: 1 };
      case 'price_desc':
        return { price: -1 };
      case 'latest':
        return { createdAt:-1 };
      default:
        return {};
    }
  })();

  const search=req.session.search
  const category=req.session.category
  const maxPrice=req.session.maxPrice
  const minPrice=req.session.minPrice
  const brand=req.session.brand
  const superCategory=req.session.superCategory
  console.log('name '+search+'cat ='+category)

  const limit=4
 
  
  const searchCondition =search ? { name: { $regex: search, $options: 'i' } } : {};

  const filterCondition={
    ...searchCondition,
    ...(category?{subcategory:category}:{}),
    ...(brand?{brand_name: brand}:{}),
    ...(minPrice?{price:{$lte:minPrice}}:{}),
    ...(maxPrice?{price:{$gte:maxPrice}}:{}),
    ...(superCategory?{category:superCategory}:{})
  }
  console.log(JSON.stringify(filterCondition, null, 2));
  const products=await Product.find(filterCondition)
  .skip((page-1)*limit)
  .limit(limit*1)
  .sort(sortCondition)

  let catName=""
  let subCatName=""
  for(let cat of products ){
    if(cat.category){
      catName=cat.category
      subCatName=cat.subcategory
      break;
    }
  }
  const foundBrand=await Brand.find({category_name:subCatName},{name:1})
  const foundCategory=await Category.findOne({name:catName})
 
  
  const count=await Product.find(filterCondition).countDocuments()
  const totalPage=Math.ceil(count/limit)
  console.log(totalPage,count);

  res.render('shopProductList',{maxPrice,minPrice,products,totalPage,currentPage:page,foundCategory,category,foundBrand,brand,search})
  
  // res.render('shoping_page',{maxPrice,minPrice,products,totalPage,currentPage:page,foundCategory,category,foundBrand,brand,search})

}
// exports.getPrdctBySearch=(req,res)=>{

//   if(req.query.search){
//     req.session.searchVal=req.query.search
//   }
    

//   //asigning the search value into the session for accesing 
//   var payload= req.session.searchVal
   
  
//   let error=null
//   let minPrice
//   let maxPrice
//   const regex = new RegExp(`(^${payload}|\\..*\\b${payload}\\b.*\\.)`, 'i');
//   CATEGORY.findOne( {name: { $regex: regex } }).populate('subcategories.products').then(p_products=>{
//     if(p_products){
//       // res.send(p_products)
      
//      const SubCatproducts=null
//      const products=null
//        res.render('shoping_page',{maxPrice,minPrice,p_products,SubCatproducts,products,error,totalPage:null})
//       return
//     }
//      CATEGORY.find().populate('subcategories.products').then(s_products=>{
//      for(let category of s_products){
//       const SubCatproducts=category.subcategories.find(subcat=>
//         subcat.name==payload,  
//         )
//         if(SubCatproducts){
//           //  res.send(SubCatproducts) 
//           const products=null
//            res.render('shoping_page',{maxPrice,minPrice,p_products,SubCatproducts,products,error,totalPage:null})
//            return
          
//         }
//      }


//         const limit=3
//         let page=1
//         if(req.query.page){
//           page=req.query.page
//         console.log(page);

//         }

     
//        Product.find({name: { $regex: regex } }).skip((page-1)*limit).limit(limit*1)
//        .then(products=>{
        
//         Product.find({name: { $regex: regex } }).countDocuments().then(totalpage=>{
//           const totalPage=Math.ceil(totalpage/limit)
//           if(products.length>0){
//             const SubCatproducts=null
    
            
//             res.render('shoping_page',{maxPrice,minPrice,p_products,SubCatproducts,products,error,totalPage})
//           // res.render('shopProductList',{maxPrice,minPrice,p_products,SubCatproducts,products,error})
    
//             return
//           }
//           const SubCatproducts=null
//           error=true
//           res.render('shoping_page',{maxPrice,minPrice,p_products,SubCatproducts,products,error,totalPage:null})

//         })
        
      
//      })

//     })
    
//   })
//   .catch(err=>{
//     res.send(err)
//   })
// }

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