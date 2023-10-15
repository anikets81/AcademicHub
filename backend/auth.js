const jwt = require('jsonwebtoken')

function authenticate(req,res,next){
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    var user;
    if (!token) {
      return res.status(401).json({ error: 'Token missing' });
    }
  
    jwt.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
      if (err) {
        return res.status(403).json({ error: 'Token invalid' });
      }
      // Attach the decoded token to the request object
      user = decodedToken;
    });
    console.log("AT AUTH: ",user);
    req.user=user;
    next();
}

module.exports=authenticate;