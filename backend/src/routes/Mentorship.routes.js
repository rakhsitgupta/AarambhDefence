import express from "express"
import { createMentorshipRequest } from "../controllers/Mentorship.controller.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = express.Router()

router.post(
    "/request",
    upload.single("paymentScreenshot"),
    createMentorshipRequest
)

export default router 