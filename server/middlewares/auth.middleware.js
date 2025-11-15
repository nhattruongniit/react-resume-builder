import jwt from "jsonwebtoken";

export default function protect(req, res, next) {
  const token = req.headers['authorization'];
  if(!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    console.log('req.userId: ', req.userId)
    next();
  } catch (error) {
    console.log('error: ', error)
    return res.status(401).json({ message: "Unauthorized" });
  }
};
