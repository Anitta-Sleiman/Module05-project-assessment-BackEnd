import jwt from "jsonwebtoken";

class Verification {
  static async verifyLogin(req, res, next) {
    const token = req.headers["authorization"];

    if (!token) {
      return res.status(401).json({ alert: "No login token provided" });
    }

    const splitToken = token.split(" ")[1];
    jwt.verify(
      splitToken,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          console.error(err.message);
          return res
            .status(403)
            .json({ message: "Failed to authenticate login token" });
        }
        req._id = decoded._id;

        next();
      }
    );
  }

  static async verifyAdmin(req, res, next) {
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).json({ alert: "No login token provided" });
    }

    const splitToken = token.split(" ")[1];
    jwt.verify(splitToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.error(err.message);
        return res
          .status(403)
          .json({ message: "Failed to authenticate login token" });
      } else if (decoded.isAdmin !== true) {
        return res
          .status(403)
          .json({ message: "Failed to authenticate login token" });
      }
      req._id = decoded._id;
      next();
    });
  }
}

export default Verification;
