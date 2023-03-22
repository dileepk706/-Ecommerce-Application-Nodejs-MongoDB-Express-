const { json } = require('body-parser');
const User=require('../model/user/user')



const {TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN ,TWILIO_SERVICE_SID}=process.env

const client=require('twilio')(TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN,{
    lazyLoading:true
})



exports. sendOTP=async(req,res)=>{
    const countryCode=req.body.countryCode
    const phoneNumber=req.body.phoneNumber

    const response= await User.findOne({phone:phoneNumber}) 
      
    if(!response){
        return res.render('login_otp',{message:'please enter valid number'})
        
    }else{
        try {
            
            const otpResponse= await client.verify.v2.services(TWILIO_SERVICE_SID).verifications.create({
                to: `${countryCode}${phoneNumber}`,
                channel:"sms",
            })
            // res.status(200).send(`OTP send successfully!: ${JSON.stringify(otpResponse)}`)
            res.render('enter_OPT',{message1:null,message2:phoneNumber})
    
        } catch (error) {
            console.log(error);
            res.status(error?.status || 400).send(error?.message || 'somthing went wrong')
        }
    }
      

}


exports.verifyOTP=async (req,res)=>{
    const num = req.body.num
    const otp = req.body.otp
    console.log(otp+""+num);
    try {
        const verifiedResponse = await client.verify.
        v2.services(TWILIO_SERVICE_SID)
        .verificationChecks.create({
            to:`+91${num}`,
            code:otp,
        })
            if(verifiedResponse.status=='approved'){
                // const num = req.body.mno
                const userDetails =await User.findOne({phone:num})
                req.session.user = userDetails._id
                res.redirect('/')
            }else{
                res.render('enter_OPT',{message1:'incorect otp',message2:num})
            }
    } catch (error) {
        console.log(error);
    }
    
}
