const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { getUser, updateUser, deleteUser, getAllUsers, updateUserById, deleteUserById } = require("../controllers/userController");

// get logged-in user
router.get("/", authMiddleware, getUser);
// update logged-in user
router.put("/", authMiddleware, updateUser);
// delete logged-in user
router.delete("/", authMiddleware, deleteUser);

// get all users (for drawer)
router.get("/all", authMiddleware, getAllUsers);
// update any user (edit / change password)
router.put("/:id", authMiddleware, updateUserById);
// delete any user
router.delete("/:id", authMiddleware, deleteUserById);

module.exports = router;



