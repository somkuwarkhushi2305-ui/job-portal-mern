import express from "express";
import { deleteJob } from "../controllers/job.controller.js";

import authenticateToken from "../middleware/isAuthenticated.js";
import {
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
} from "../controllers/job.controller.js";

const router = express.Router();

router.route("/post").post(authenticateToken, postJob);
router.route("/get").get(getAllJobs);
router.route("/getadminjobs").get(authenticateToken, getAdminJobs);
router.route("/get/:id").get(authenticateToken, getJobById);
router.delete("/delete/:id", authenticateToken, deleteJob);
export default router;
