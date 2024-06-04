import express from 'express'
import * as commentController from '../controllers/commentController.js';

const router = express.Router()

router.route("/fetch-reviews").post(commentController.analyze)
router.route("/previous-analyses").get(commentController.getAnalyzes)

export default router   
