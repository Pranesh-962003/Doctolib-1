import jwt from 'jsonwebtoken'

// user auth Middleware


const authUser = async(req,res,next)=>{
    try{

        const {token } = req.headers

        if(!token){
            return res.json({success:false,message:"Not authorise Login again"})
        }

        const token_decode = jwt.verify(token,process.env.JWT_SECRETE)

        req.body.userId = token_decode.id

        next()


    }catch(err){
        console.log(err)
        res.json({success:false,message:err})
        
    }
}

export default authUser;