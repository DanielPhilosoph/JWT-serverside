const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { USERS, INFORMATION, REFRESHTOKENS } = require("../assets/users");

exports.login = (req, res) => {
  let user = USERS.filter((user) => {
    return req.body.email === user.email;
  });
  if (user.length > 0) {
    // Email exists
    //let hash = bcrypt.hashSync(req.body.password, parseInt(process.env.SALT));
    let result = bcrypt.compare(req.body.password.toString(), user[0].password);
    if (result) {
      // Can get it
      getInfo = INFORMATION.filter((info) => {
        return info.email === user[0].email;
      });
      const token = jwt.sign(
        { email: user[0].email, info: getInfo[0].info },
        process.env.SECRET,
        { expiresIn: "10s" }
      );
      const refreshToken = jwt.sign(
        { email: user[0].email, info: getInfo[0].info },
        process.env.SECRET,
        { expiresIn: "1h" }
      );
      REFRESHTOKENS.push(refreshToken);
      res.status(200).json({
        accessToken: token,
        refreshToken: refreshToken,
        email: user[0].email,
        name: user[0].name,
        isAdmin: user[0].isAdmin,
      });
    } else {
      throw { code: 403, message: "User or Password incorrect" };
    }
  } else {
    // Cant find user
    throw { code: 404, message: "cannot find user" };
  }
};

exports.register = (req, res) => {
  let hashPassword = bcrypt.hashSync(
    req.body.password.toString(),
    parseInt(process.env.SALT)
  );
  let validObj = validateRegisterRequest(
    req.body.email,
    req.body.name,
    req.body.password
  );
  if (validObj.valid) {
    USERS.push({
      email: req.body.email,
      name: req.body.name,
      password: hashPassword,
      isAdmin: false,
    });
    INFORMATION.push({
      email: req.body.email,
      info: `${req.body.name} info`,
    });
    res.status(validObj.code).send("Register Success");
  } else {
    throw { code: validObj.code, message: validObj.message };
  }
};

exports.logout = (req, res) => {
  if (!req.body.token) {
    throw { code: 400, message: "Refresh Token Required" };
  } else {
    let refreshToken = REFRESHTOKENS.find((token) => token === req.body.token);
    if (refreshToken) {
      let index = REFRESHTOKENS.indexOf(refreshToken);
      REFRESHTOKENS.splice(index, 1);
    }
    res.send("logout");
  }
};

exports.tokenValidate = (req, res) => {
  try {
    if (!req.headers.authorization) {
      throw { code: 401, message: "Access Token Required" };
    }
    jwt.verify(req.headers.authorization.slice(7), process.env.SECRET);
    res.json({ valid: true });
  } catch (error) {
    throw { code: 403, message: "Invalid Access Token" };
  }
};

exports.token = (req, res) => {
  if (!req.body.token) {
    throw { code: 401, message: "Refresh Token Required" };
  }
  try {
    const decoded = jwt.verify(req.body.token, process.env.SECRET);
    const token = jwt.sign(
      { email: decoded.email, info: decoded.info },
      process.env.SECRET,
      {
        expiresIn: "10s",
      }
    );
    res.json({ accessToken: token });
  } catch (error) {
    throw { code: 403, message: "Invalid Refresh Token" };
  }
};

function validateRegisterRequest(email, name, password) {
  if (!email || !name || !password) {
    return {
      valid: false,
      message: "Missing property (email/name/password)",
      code: 400,
    };
  }
  const reg = new RegExp("^[0-9]+$");
  if (reg.test(name)) {
    return {
      valid: false,
      message: "name cant be only numbers",
      code: 400,
    };
  }
  if (isUserExists(email, name)) {
    return {
      valid: false,
      message: "user already exists",
      code: 409,
    };
  }
  return {
    valid: true,
    message: "Register Success",
    code: 201,
  };
}

function isUserExists(email, name) {
  let filteredUsers = USERS.filter((user) => {
    return user.name === name && user.email == email;
  });
  if (filteredUsers.length > 0) {
    return true;
  }
  return false;
}
