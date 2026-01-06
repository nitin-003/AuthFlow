const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const { getUser, updateUser, deleteUser, getAllUsers, updateUserById, deleteUserById } = require("../controllers/userController");

router.get("/", authMiddleware, getUser);
router.put("/", authMiddleware, updateUser);
router.delete("/", authMiddleware, deleteUser);

router.get("/all", authMiddleware, getAllUsers);
router.put("/:id", authMiddleware, updateUserById);
router.delete("/:id", authMiddleware, deleteUserById);

module.exports = router;



