const jwt = require("jsonwebtoken");
const { USERS } = require("../assets/users");

exports.options = (req, res) => {
  try {
    if (!req.headers.authorization) {
      // Has no token
      res.json({
        Allow: "OPTIONS, GET, POST",
        body: [apiOptions[0], apiOptions[1]],
      });
    } else {
      let decoded = jwt.verify(
        req.headers.authorization.slice(7),
        process.env.SECRET
      );
      let user = USERS.filter((user) => decoded.email === user.email);
      if (user.length > 0 && user[0].isAdmin) {
        // Is admin
        res.json({ Allow: "OPTIONS, GET, POST", body: apiOptions });
      } else {
        // Is authenticated user
        res.json({
          Allow: "OPTIONS, GET, POST",
          body: [
            apiOptions[0],
            apiOptions[1],
            apiOptions[2],
            apiOptions[3],
            apiOptions[4],
            apiOptions[5],
          ],
        });
      }
    }
  } catch (error) {
    // Invalid token user
    res.json({
      Allow: "OPTIONS, GET, POST",
      body: [apiOptions[0], apiOptions[1], apiOptions[2]],
    });
  }
};

const apiOptions = [
  {
    method: "post",
    path: "/users/register",
    description: "Register, Required: email, name, password",
    example: {
      body: { email: "user@email.com", name: "user", password: "password" },
    },
  },
  {
    method: "post",
    path: "/users/login",
    description: "Login, Required: valid email and password",
    example: { body: { email: "user@email.com", password: "password" } },
  },
  {
    method: "post",
    path: "/users/token",
    description: "Renew access token, Required: valid refresh token",
    example: { headers: { token: "*Refresh Token*" } },
  },
  {
    method: "post",
    path: "/users/tokenValidate",
    description: "Access Token Validation, Required: valid access token",
    example: { headers: { Authorization: "Bearer *Access Token*" } },
  },
  {
    method: "get",
    path: "/api/v1/information",
    description: "Access user's information, Required: valid access token",
    example: { headers: { Authorization: "Bearer *Access Token*" } },
  },
  {
    method: "post",
    path: "/users/logout",
    description: "Logout, Required: access token",
    example: { body: { token: "*Refresh Token*" } },
  },
  {
    method: "get",
    path: "api/v1/users",
    description: "Get users DB, Required: Valid access token of admin user",
    example: { headers: { authorization: "Bearer *Access Token*" } },
  },
];
