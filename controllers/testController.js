const { verify } = require("jsonwebtoken");
module.exports = {
    
    decodeJsonWebToken : (req, res) => {
        const jwtreq = req.body.token;
       
        const decoded = verify(jwtreq, process.env.SALT)
        res.send(decoded.result);
    }
}