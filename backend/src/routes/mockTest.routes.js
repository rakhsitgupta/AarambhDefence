const express = require("express");
const router = express.Router();
const { auth, isInstructor } = require("../middlewares/auth");
const {
    createMockTest,
    getAllMockTests,
    enrollInMockTest,
} = require("../controllers/mockTest.controller");

// Public routes
router.get("/", getAllMockTests);

// Protected routes
router.post("/", auth, isInstructor, createMockTest);
router.post("/:mockTestId/enroll", auth, enrollInMockTest);

module.exports = router; 