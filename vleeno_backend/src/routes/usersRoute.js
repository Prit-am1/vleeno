import express from "express";
import {
  registerUser,
  getAllUsers,
  getSingleUser,
  updateSingleUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", registerUser);
router.get("/", getAllUsers);
router.get("/:id", getSingleUser);
router.patch("/:id", updateSingleUser);
router.delete("/:id", deleteUser);

export default router;

