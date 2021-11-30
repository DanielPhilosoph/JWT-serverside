const express = require("express");
const router = express.Router();
const { options } = require("../controllers/endpoints");

router.options("/", options);

module.exports = router;
