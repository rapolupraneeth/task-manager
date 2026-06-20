const jwt = require ('jsonwebtoken');
const User = require('../models/User');
const protect = async (req,res,next)=>{
    let token;

    //check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            //extract token (format:"Bearer <token")
            token=req.headers.authorization.split(' ')[1];

            //verify token
            const decoded = jwt.verify(token,process.env.JWT_SECRET);

            //get user from token, attach to request (exclusive password)
            req.user = await User.findById(decoded.id).select('-password');

            next();//move to actual route handler
        } catch (error){
            console.log('JWT ERROR:',error.message);
            res.status(401).json({message:'Not authorized, token failed'});
        }
    }
    if (!token){
        res.status(401).json({message:'Not authorized,no token'});
    }
};
module.exports={protect};