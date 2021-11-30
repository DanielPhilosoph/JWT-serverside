const express = require("express");
const router = express.Router();
const { information, users } = require("../controllers/v1");

router.get("/information", information);

router.get("/users", users);

module.exports = router;
