import jwt from 'jsonwebtoken'

// Admin auth Middleware


const authAdmin = async(req,res,next)=>{
    try{

        const {atoken } = req.headers

        if(!atoken){
            return res.json({success:false,message:"Not authorise Login again"})
        }

        const token_decode = jwt.verify(atoken,process.env.JWT_SECRETE)

        if(token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
            return res.json({success:false,message:"Not authorise Login again"})
        }

        next()


    }catch(err){
        console.log(err)
        res.json({success:false,message:err})
        
    }
}

export default authAdmin;