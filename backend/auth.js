const jwt = require('jsonwebtoken')

function authenticate(req,res,next){
  console.log(req.body.courseId)



    const token = req.cookies?.token;
    console.log(token);
    var user;
    if (!token) {
      return res.status(401).json({ error: 'Token missing' ,isAuthenticated: false});
    }
  
    jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
      if (err) {
        return res.status(403).json({ error: 'Token invalid',isAuthenticated: false });
      }
      // Attach the decoded token to the request object
      user = decodedToken;

      console.log("AT AUTH: ",user);
      req.user=user;
      next();
    });
    
}

module.exports=authenticate;