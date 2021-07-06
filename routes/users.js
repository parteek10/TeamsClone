const express = require("express");
const { logoutUser, registerUser, loginUser } = require("../controllers/users");
const auth = require("../middleware/auth");
const router = express.Router();
router.get("/logout", auth, logoutUser);

router.post("/user/signup", registerUser);

router.post("/user/signin", loginUser);

module.exports = router;