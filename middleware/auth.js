
require("dotenv/config");
const _=require('lodash');
const jwt=require('jsonwebtoken');

module.exports=(req,res,next)=>{
    //if (req.user === undefined) return res.status(404).send({ msg: "User not loggedin" });
  if (_.isUndefined(req.header("Authorization"))) {
    
    const token = req.query.access_token;
    if (!token)
      return next({code:401,msg:"Access denied.No Authorization token"});
    
    try {
      const valid = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {};
      req.user.id = valid._id;
      req.user.email = valid.email;
      next();
    } catch (ex) {
      console.log("Invalid JWT");
      next({code:400,msg:"Invalid Access token"});
      // res.status(400).send("Invalid Access token");
    }
  } else {
    const token = req.header("Authorization").split(" ")[1];
    if (!token)
      return next({code:401,msg:"Access denied.No Authorization token"});
      // return res.status(401).json("Access denied.No Authorization token");
    try {
      const valid = jwt.verify(token, process.env.JWT_SECRET);
      console.info("User ("+valid._id+") is authenticated!!!:");
      req.user = {};
      req.user.id = valid._id;
      req.user.email = valid.email;
      next();
    } catch (ex) {
      console.log(ex);
      next({code:409,msg:ex.name+" "+ex.message});
      // res.status(400).json("Invalid Access token");
    }
  }

};