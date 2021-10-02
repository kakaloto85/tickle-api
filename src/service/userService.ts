import { createDB } from "../common/db";
import { createPool, Pool, OkPacket, RowDataPacket } from "mysql2/promise";
import express from "express";

class UserService {
  private db: Pool;
  constructor() {
    this.db = createDB();
  }
  public async getAllCompletedTasksOfUser(
    req: express.Request,
    res: express.Response
  ) {
    try {
      // const [
      //   result,
      // ] = await this.db.query(
      //   "select T.*,MT.completed,MT.completedAt from Task as T, MarkedTask as MT where T.id = MT.taskId and MT.userId = ? and MT.completed = true",
      //   [req.params.userId]
      // );
      const [
        result,
      ] = await this.db.query(
        "select T.*,true as completed, CT.completedAt from Task as T, CompletedTask as CT where T.id = CT.taskId and CT.userId = ?",
        [req.params.userId]
      );

      return res.status(200).json({
        status: 200,
        data: result,
      });
    } catch (err) {
      return res.status(400).json({ status: 400, message: err.message });
    }
  }
  public async getAllTasksOfUser(req: express.Request, res: express.Response) {
    try {
      const [result] = await this.db.query<RowDataPacket[]>(
        "select T.* from Task as T, MarkedTask as MT where T.id = MT.taskId and MT.userId = ? ",
        [req.params.userId]
      );
      const [completedList] = await this.db.query<RowDataPacket[]>(
        "select distinct CT.taskId, CT.completedAt from CompletedTask as CT where CT.userId=? and DATE(CT.completedAt) =DATE(NOW())+1",
        [req.params.userId]
      );

      console.log(completedList);
      return res.status(200).json({
        status: 200,
        data: result.map((task) => {
          const completed = completedList.find((c) => c.taskId === task.id);
          if (completed) {
            return {
              ...task,
              completed: true,
              completedAt: completed.completedAt,
            };
          }
          return { ...task, completed: false, completedAt: null };
        }),
      });
    } catch (err) {
      return res.status(400).json({ status: 400, message: err.message });
    }
  }

  public async getAll(req: express.Request, res: express.Response) {
    try {
      const [result] = await this.db.query("select * from User");

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
      const [result] = await this.db.query<OkPacket>(
        "insert into User(accessToken, nickname, profileImage) values ?",
        [[[body.accessToken, body.nickname, body.profileImage]]]
      );

      return res.status(200).json({
        status: 200,
        data: result.insertId,
      });
    } catch (err) {
      return res.status(400).json({ status: 400, message: err.message });
    }
  }
  public async markTask(req: express.Request, res: express.Response) {
    const body = req.body;
    try {
      const [result1] = await this.db.query<OkPacket>(
        "insert into MarkedTask(userId, taskId) values ?",
        [[[req.params.userId, body.taskId]]]
      );

      return res.status(200).json({
        status: 200,
        data: result1.changedRows,
      });
    } catch (err) {
      return res.status(400).json({ status: 400, message: err.message });
    }
  }
  public async unmarkTask(req: express.Request, res: express.Response) {
    const body = req.body;
    try {
      const [result1] = await this.db.query<OkPacket>(
        "delete from MarkedTask where userId=? and taskId=?",
        [req.params.userId, body.taskId]
      );

      return res.status(200).json({
        status: 200,
        data: result1.changedRows,
      });
    } catch (err) {
      return res.status(400).json({ status: 400, message: err.message });
    }
  }

  public async completeTask(req: express.Request, res: express.Response) {
    const body = req.body;
    try {
      // const [result1] = await this.db.query<OkPacket>(
      //   "update MarkedTask set completed = true, completedAt =? where userId =? and taskId=?",
      //   [new Date(), req.params.userId, body.taskId]
      // );
      const [result1] = await this.db.query<OkPacket>(
        "insert into CompletedTask(completedAt,userId,taskId) values ?",
        [[[new Date(), req.params.userId, body.taskId]]]
      );

      const [[result2]] = await this.db.query<RowDataPacket[]>(
        "select * from Task where id = ?",
        [body.taskId]
      );
      console.log(result2.point, req.params.userId);
      const [result3] = await this.db.query<OkPacket>(
        "update User set point = point + ? where id = ?",
        [result2.point, req.params.userId]
      );

      return res.status(200).json({
        status: 200,
        data: result3.changedRows,
      });
    } catch (err) {
      return res.status(400).json({ status: 400, message: err.message });
    }
  }

  public async getOne(req: express.Request, res: express.Response) {
    console.log("/get");
    console.log(req.params.userId);
    console.log(this.db);
    try {
      console.log(this.db);
      const [[result]] = await this.db.query<RowDataPacket[]>(
        "select * from User where id = ?",
        [req.params.userId]
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
  public async login(req: express.Request, res: express.Response) {
    console.log("/get");
    console.log(req.params.accessToken);
    try {
      const [result] = await this.db.query<RowDataPacket[]>(
        "select * from User where accessToken = ?",
        [req.body.accessToken]
      );
      console.log(result);
      if (result.length > 0) {
        return res.status(200).json({
          status: 200,
          data: result[0],
        });
      } else {
        return res.status(401).json({
          status: 401,
          message: "로그인 실패",
        });
      }
    } catch (err) {
      return res.status(400).json({ status: 400, message: err.message });
    }
  }

  public async update(req: express.Request, res: express.Response) {
    const body = req.body;
    try {
      const [result1] = await this.db.query<OkPacket>(
        "update User set nickname =? where id =?",
        [body.nickname, req.params.userId]
      );
      return res.status(200).json({
        status: 200,
        data: result1.affectedRows,
      });
    } catch (err) {
      return res.status(400).json({ status: 400, message: err.message });
    }
  }
}

const userService = new UserService();
export { userService };
