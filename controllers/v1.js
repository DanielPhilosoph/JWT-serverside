const jwt = require("jsonwebtoken");
const { USERS } = require("../assets/users");

exports.information = (req, res) => {
  try {
    if (!req.headers.authorization) {
      throw { code: 401, message: "Access Token Required" };
    }
    let decoded = jwt.verify(
      req.headers.authorization.slice(7),
      process.env.SECRET
    );
    res.json([{ email: decoded.email, info: decoded.info }]);
  } catch (error) {
    throw { code: 403, message: "Invalid Access Token" };
  }
};

exports.users = (req, res) => {
  try {
    if (!req.headers.authorization) {
      throw { code: 401, message: "Access Token Required" };
    }
    let decoded = jwt.verify(
      req.headers.authorization.slice(7),
      process.env.SECRET
    );
    let user = USERS.filter((user) => decoded.email === user.email);
    if (user.length > 0 && user[0].isAdmin) {
      res.json({ USERS: USERS });
    } else {
      throw { code: 405, message: "Only Admin Can Get" };
    }
  } catch (error) {
    throw { code: 403, message: "Invalid Access Token" };
  }
};
