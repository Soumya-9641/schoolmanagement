import { Router } from "express";
import { addSchool ,listSchools } from "../controllers/schoolController";

const router = Router();

//@ts-ignore
router.post("/addSchool", addSchool);
//@ts-ignore
router.get("/listSchools", listSchools);
export default router;
