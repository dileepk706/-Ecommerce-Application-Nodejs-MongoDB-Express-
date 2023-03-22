const axios=require('axios');
const { response } = require('express');

exports.categoryPagerender= async(req,res)=>{
    try {
      const response = await axios.get('http://localhost:3000/admin/category');
      const categories = response.data
   
       
      res.render('adminCtegoryManegment',{categories})
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error' + error);
    }
  }

exports.addCategory=(req,res)=>{
    res.render('adminAddCategory')
}

exports.addSubcategory=(req,res)=>{

    res.render('adminAddSubCat',{name:req.query.pName})
}

exports.addProductForm=async (req,res)=>{
    try {
        const response= await axios.get('http://localhost:3000/admin/category_and_subcategory_list')
        const categories=response.data.category_details 
        const brand=response.data.brand
        res.render('adminAddProduct',{categories,brand})    
    } catch (error) {  
    }
}

exports.productList= async (req,res)=>{
    try {
        const responce= await axios.get('http://localhost:3000/admin/products')
        if(!responce){
            return res.send('somthing went wrong')
        }
        const products=responce.data
        return res.render('productListForAdmin',{products})
    } catch (error) {
        res.send(error)
    }
  }

exports.adminDashbord=(req,res)=>{
    res.render('dashboard')
}

exports.addBrand=async(req,res)=>{
    try {
        const responce= await axios.get('http://localhost:3000/admin/category_and_subcategory_list')
        if(!responce){
            return res.send('somthing went wrong')
        }
        const brand=responce.data.brand
        return res.render('adminAddBrand',{brand})
    } catch (error) {
        res.send(error)
    }
}

exports.adminLoginPage=(req,res)=>{
    if(req.session.admin){
        res.redirect('/admin/dashboard')
    }else{
        res.render('adminLoginPage',{message:null})
    }
  }

exports.updateProduct=async (req,res)=>{
  const id=req.query.id
  try {
    const response=await axios.get(`http://localhost:3000/admin/products/edit?id=${id}`)
    const product=response.data
 
    res.render('adminUpdateProduct',{product})
  } catch (error) {
    res.send('error')
  }
}

exports.updateCategory=(req,res)=>{
  const id=req.query.id
  const name=req.query.name
  res.render('adminUpdatecategory',{id,name})
}