import express from "express";
import { categoryService } from "../service/CategoryService";

const taskRouter = express.Router();

taskRouter.get("/", function (req, res) {
  categoryService.getAll(req, res);
});

taskRouter.get("/:categoryId", function (req, res) {
  categoryService.getOne(req, res);
});
taskRouter.get("/:categoryId/pointSum", function (req, res) {
  categoryService.getPointsOfCategory(req, res);
});

taskRouter.get("/:categoryId/task", function (req, res) {
  categoryService.getAllTasksOfCategory(req, res);
});

taskRouter.post("/", function (req, res) {
  categoryService.create(req, res);
});

export default taskRouter;
