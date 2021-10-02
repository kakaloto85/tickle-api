import express from "express";
import taskRouter from "./task";
import categoryRouter from "./category";
import userRouter from "./user";
const router = express.Router();

router.use("/task", taskRouter);
router.use("/category", categoryRouter);
router.use("/user", userRouter);

export default router;
