import express from "express";
import { userService } from "../service/userService";

const userRouter = express.Router();

userRouter.post("/login", function (req, res) {
  userService.login(req, res);
});
userRouter.get("/:userId", function (req, res) {
  userService.getOne(req, res);
});
userRouter.get("/", function (req, res) {
  userService.getAll(req, res);
});

userRouter.get("/:userId/task", function (req, res) {
  userService.getAllTasksOfUser(req, res);
});
userRouter.get("/:userId/completedTask", function (req, res) {
  userService.getAllCompletedTasksOfUser(req, res);
});

// userRouter.get("/:userId/completedTask", function (req, res) {
//   userService.getAllCompletedTasksOfUser(req, res);
// });

userRouter.put("/:userId", function (req, res) {
  userService.update(req, res);
});
userRouter.post("/:userId/completeTask", function (req, res) {
  userService.completeTask(req, res);
});
userRouter.post("/:userId/markTask", function (req, res) {
  userService.markTask(req, res);
});
userRouter.post("/:userId/unmarkTask", function (req, res) {
  userService.unmarkTask(req, res);
});

userRouter.post("/", function (req, res) {
  userService.create(req, res);
});

export default userRouter;
