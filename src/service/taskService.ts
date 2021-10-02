import { createDB } from "../common/db";
import { createPool, Pool, OkPacket, RowDataPacket } from "mysql2/promise";
import express from "express";

class TaskService {
  private db: Pool;
  constructor() {
    this.db = createDB();
  }

  public async getAll(req: express.Request, res: express.Response) {
    try {
      const [result] = await this.db.query("select * from Task");

      return res.status(200).json({
        status: 200,
        data: result,
      });
    } catch (err) {
      return res.status(400).json({ status: 400, message: err.message });
    }
  }
  public async getRandomTasks(req: express.Request, res: express.Response) {
    try {
      const [[result]] = await this.db.query<RowDataPacket[]>(
        "select count(*) as count from Task where"
      );
      const randomNum = Number(req.query.num) || 5;

      const len = result.count;
      const today = new Date();
      const encoded = today.getDate() + today.getFullYear() + today.getMonth();
      const index = encoded % len;
      const randomIndexList = [];
      const counter = 0;

      return res.status(200).json({
        status: 200,
        data: result,
      });
    } catch (err) {
      return res.status(400).json({ status: 400, message: err.message });
    }
  }

  public async getAllCompleteUser(req: express.Request, res: express.Response) {
    try {
      const [
        result,
      ] = await this.db.query(
        "select U.* from User as U, CompletedTask as CT where U.id = CT.userId and CT.taskId= ? and DATE(CT.completedAt) =DATE(NOW())+1",
        [req.params.taskId]
      );

      return res.status(200).json({
        status: 200,
        data: result,
      });
    } catch (err) {
      return res.status(400).json({ status: 400, message: err.message });
    }
  }

  public async create(req: express.Request, res: express.Response) {
    const body = req.body;
    try {
      const [result1] = await this.db.query<OkPacket>(
        "insert into Task(description, point, label, emoji) values ?",
        [[[body.description, body.point, body.label, body.emoji]]]
      );
      const [result2] = await this.db.query<OkPacket>(
        "insert into TaskCategoryMap(categoryId, taskId) values ?",
        [[[body.categoryId, result1.insertId]]]
      );

      return res.status(200).json({
        status: 200,
        data: result2.insertId,
      });
    } catch (err) {
      return res.status(400).json({ status: 400, message: err.message });
    }
  }
  public async update(req: express.Request, res: express.Response) {
    const body = req.body;
    try {
      const [result1] = await this.db.query<OkPacket>(
        "update Task set description =?, point =?, label =?, emoji =? where id =?",

        [
          body.description,
          body.point,
          body.label,
          body.emoji,
          req.params.taskId,
        ]
      );
      return res.status(200).json({
        status: 200,
        data: result1.affectedRows,
      });
    } catch (err) {
      return res.status(400).json({ status: 400, message: err.message });
    }
  }

  public async getOne(req: express.Request, res: express.Response) {
    console.log("/get");
    console.log(req.params.taskId);
    console.log(this.db);
    try {
      console.log(this.db);
      const [[result]] = await this.db.query<RowDataPacket[]>(
        "select * from Task where id = ?",
        [req.params.taskId]
      );
      console.log(result);

      return res.status(200).json({
        status: 200,
        data: result,
      });
    } catch (err) {
      return res.status(400).json({ status: 400, message: err.message });
    }
  }
}

const taskService = new TaskService();
export { taskService };
