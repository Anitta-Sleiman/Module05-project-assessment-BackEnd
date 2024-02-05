import jwt from "jsonwebtoken";

class FrontVerify {
  static async verifyLogin(req, res, next) {
    const { token, isAdmin } = req.body;

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        console.error(err.message);
        return res
          .status(403)
          .json({ message: "Failed to authenticate login token", status: 403 });
      }
      return res.status(200).json({ status: 200 });

      next();
    });
  }

  static async verifyAdmin(req, res, next) {
    const { token, isAdmin } = req.body;
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        console.error(err.message);
        return res
          .status(403)
          .json({ message: "Failed to authenticate login token" });
      } else if (isAdmin !== true) {
        return res
          .status(403)
          .json({ message: "Failed to authenticate login token", status: 403 });
      }
      return res.status(200).json({ status: 200 });
      next();
    });
  }
}

export default FrontVerify;
