import express from "express";
import { taskService } from "../service/taskService";

const taskRouter = express.Router();

taskRouter.get("/", function (req, res) {
  taskService.getAll(req, res);
});
taskRouter.get("/today", function (req, res) {
  taskService.getRandomTasks(req, res);
});

taskRouter.get("/:taskId", function (req, res) {
  taskService.getOne(req, res);
});

taskRouter.get("/:taskId/user", function (req, res) {
  taskService.getAllCompleteUser(req, res);
});

taskRouter.put("/:taskId", function (req, res) {
  taskService.update(req, res);
});

taskRouter.post("/", function (req, res) {
  taskService.create(req, res);
});

export default taskRouter;
