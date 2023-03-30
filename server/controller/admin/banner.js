const Banner=require('../../model/banner/banner')
const Category=require('../../model/category/category')

exports.bannerFormForCreate=async (req,res)=>{
    try {
        const categories=await Category.find()
        res.render('bannerForm',{categories}) 
    } catch (error) {
        console.log(error);
    }
    
}

exports.createBanner=async (req,res)=>{
  
    try {
      const {categoryname,name}=req.body
      const image = req.file.filename
  
      const banner=new Banner({
        name:name,
        category_name:categoryname,
        image:image
      })
  
    await banner.save()
    res.redirect('/admin/banner')
  
    } catch (error) {
      console.log(error);
    }
}

exports.getAllBanner=async(req,res)=>{

    try {
      const banner=await Banner.find()
    
      res.render('bannerList',{banner})
    } catch (error) {
      console.log(error);
    }
   
}

exports.getSingleBannerInfo=async (req,res)=>{
    try {
      const banner=await Banner.findById({_id:req.params.id})
      res.render('updateBanner',{banner})
    } catch (error) {
      console.log(error)
    }
    
}

exports.updateBanner=async(req,res)=>{
  
    try {
      const {categoryname,name}=req.body
      console.log(categoryname,name);
      await Banner.findByIdAndUpdate({_id:req.params.id},{
        name: name,
        category_name: categoryname
      })
      res.redirect('/admin/bannerlist')
      return
    } catch (error) {
      console.log(error);
    }
  
}

exports.deleteBanner=async (req,res)=>{

    try {
     await  Banner.findByIdAndDelete({_id:req.params.id})
     res.status(200).json({message:'Banner deleted'})
    } catch (error) {
     console.log(error)
    }
}
