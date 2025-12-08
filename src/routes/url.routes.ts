import {Router} from "express"
import { createShortUrl, redirectToOriginal } from "../controllers/urlController.js"


const router = Router()


router.route("/shorten").post(
    createShortUrl
)

router.route("/:shortCode").get(
    redirectToOriginal
)

export default router