const Category = require ('../../model/category/category')
const Brand=require('../../model/brand/brand')

exports.addCategory = async (req, res) => {
  try {
    const name = req.body.name;
    const image = req.file.filename;

    const existingCategory = await Category.findOne({ name: name });
    if (existingCategory) {
      return res.status(301).json({ message: 'the category already exists' });
    }

    const category = new Category({
      name: name,
      image: image,
      subcategories: []
    });

    await category.save();
    res.status(201).json({ message: 'category created successfully '});
  } catch (error) {
    if (error instanceof multer.MulterError) {
      // handle multer errors
      return res.status(400).json({ message: error.message });
    } else {
      // handle other errors
      return res.status(500).json({ message: 'something went wrong' });
    }
  }
};




 exports.addSubCategory=(req,res)=>{
  const parentCategory=req.body.parentCategory
  const subCategory=req.body.subCategory
  const newSubCategoy={
    name:subCategory,
    products:[]
  }
  let foundedcat=null
  Category.findOne({name:parentCategory}).then(category=>{
    for(let subcat of category.subcategories){
      if (subcat.name==subCategory) {
        return res.status(401).send('<h2 style="margin-top: 72px; margin-left: 513px;">the subcategory is already exist</h2>')
        break;
      }
    }
    category.subcategories.push(newSubCategoy)
    category.save()
    .then(result=>{
      res.redirect('/admin/view_category')
      // return res.status(201).send({message:'subcategory added succesfully'})
    })
    .catch(err=>{
      return res.status(401).send({message:'eror while save the  sub category '+err});
    })
  })
  .catch(err=>{ 
    return res.status(401).send({message:'error while save sub the category '+err});
  })
 }



exports.categoryList=(req,res)=>{
 Category.find({isDeleted:false}).then(categories=>{
   if(!categories){
     res.status(501).send({message:'somthing went wrong'})
   }else{
     res.status(200).send(categories)
   }
 }).catch(err=>{
   res.status(501).send('somthing went wrong ' + err)
 })
}

exports.categoryDetails=async(req,res)=>{
  try {
  const brand=await Brand.find()
  Category.find().populate('subcategories').then( category_details=>{
    if(!category_details){
      res.status(401).send({message:'cannot find the subcategory'})
      return
    }else{
      return res.status(200).send({category_details,brand})
    }
  })
  .catch(err=>{
    res.status(502).send({messsage:'somthing went wrong ' + err})
  })
  } catch (error) {
    
  }
  
}

exports.deleteCategory=(req,res)=>{
  const _id = req.query.id;
  console.log(_id);
  Category.findByIdAndUpdate({_id}, { isDeleted: true }).then(data=>{
    if(!data){
      return res.status(404).json({message:'cant find the category'})
    }
    return res.status(200).json({message:'Category deleted succefully'})
  }).catch(err=>{
    return res.status(500).json({message:'somthing went wrong' })
  })
    // handle error and result)
}

exports.deleteSubCategory= (req,res)=>{
  const subCat_id=req.query.id
  const parrent_id=req.query.Pid
  Category.findById({_id:parrent_id}).then(category=>{
    if(!category){
      return res.status(404).send({message:'the category is not found'})
    }
    const subCatIndex=category.subcategories.findIndex(subcategory=>subcategory.id===subCat_id)
    category.subcategories[subCatIndex].isDeleted=true
    return category.save()
  }).then(isSave=>{
    return res.status(200).send({message:'subcategory deleted succefully'})
  }).catch(err=>{
    res.status(500).send({message:'somthing went wrong!!!'})
  })
}

exports.updateCategory=(req,res)=>{
  const {name,id}=req.body
  console.log(name,id);
  Category.findByIdAndUpdate({_id:id},{
    name:name,
  }).then(data=>{
    res.status(200).json({message:'Category updated succefully'})
  }).catch(err=>{
    console.log(err);
    res.status(500).json({message:'womthing went wrong'})
  })
}