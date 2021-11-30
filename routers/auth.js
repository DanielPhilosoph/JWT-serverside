const express = require("express");
const router = express.Router();
const {
  login,
  register,
  logout,
  tokenValidate,
  token,
} = require("../controllers/authJWT");

router.post("/login", login);

router.post("/logout", logout);

router.post("/register", register);

router.get("/tokenValidate", tokenValidate);

router.post("/token", token);

module.exports = router;
