import express from "express";

import authenticateToken from "../middleware/isAuthenticated.js";
import {
  getAllCompanies,
  getCompanyById,
  registerCompany,
  updateCompany,
} from "../controllers/company.controller.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/register").post(registerCompany);
router.route("/get").get(getAllCompanies);
router.route("/get/:id").get(getCompanyById);
router.route("/update/:id").put(singleUpload, updateCompany);
export default router;
