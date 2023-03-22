const axios=require('axios')


exports.userhome=async (req, res) => {
    try {
      const response = await axios.get('http://localhost:3000/user');
      const categories = response.data.category
      const mobiles=response.data.mobiles
      const headphones=response.data.headphones
     console.log(mobiles);
      res.render('userHmome', { categories,mobiles,headphones});
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error' + error);
    }
  };


  exports.userCategoryHome=(req,res)=>{
    const name=(req.query.name)
    res.send(name)
  }

  exports.userLogin=(req,res)=>{
    if(req.session.user){
      res.redirect('/')
    }else{
      res.render('UserLoginPage',{message:null})

    }
  }

  exports.userSignup=(req,res)=>{
    res.render('UserSignupPage')
  }
  
  


  
//   app.get('/', async (req, res) => {
//     try {
//       const response = await axios.get('http://localhost:3000/user');
//       const categories = response.data.category
//       const mobiles=response.data.mobiles
//       const brand=response.data.brand
      
//       console.log(categories);
//       console.log(mobiles);
//       res.render('userHmome', { categories,mobiles });
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Internal Server Error' + error);
//     }
//   });