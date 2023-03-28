const Brand = require('../../model/brand/brand')

exports.addBrand=(req,res)=>{
    const brndName=req.body.name
    const catName=req.body.catName
    const image = req.file.filename
    const brand = new Brand({
        name:brndName,
        category_name:catName,
        image:image,
        products:[]
    })
    Brand.findOne({name:brndName}).then(foundBrand=>{
        if(foundBrand){
            return res.status(301).send({message:'the brand is alresdy exist'})
        }else{
            brand.save().then(result=>{
                return res.status(201).send({message:'brand added succefully'})
            }).catch(err=>{
                return res.status(401).send({message:'somthing went wrong'+err})
            })
        }
    }).catch(error=>{
        if (error instanceof multer.MulterError) {
            // handle multer errors
            return res.status(400).json({ message: error.message });
          } else {
            // handle other errors
            return res.status(500).json({ message: 'something went wrong' });
          }
    })
}