import jwt from "jsonwebtoken";

const isAuthenticated =  (req, res, next) => {
    try{
        const token = req.cookies.token; //1. we will get the token from the cookie
        if(!token){
            return res
            .status(401)
            .json({
                message: "No token provided, authentication failed",
                success: false,
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET); //2. we will verify the token using the secret key
        if(!decoded){
            return (
            res.status(401)
            .json({
                message: "Invalid token, authentication failed"}),
                (success = false)
            );
            }
            req.id = decoded.userId; //3. if the token is valid then we will get the userId from the decoded token and we will set it to the request object so that we can use it in the next middleware or controller function
            next(); //4. if the token is valid then we will call the next middleware or controller function

    } catch (error) {
        res.status(401).json({
            message: "Invalid token, authentication failed",
            success: false,
        });
    }
};

export default isAuthenticated;