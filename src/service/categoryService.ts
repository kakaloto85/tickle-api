import { createDB } from "../common/db";
import { createPool, Pool, OkPacket, RowDataPacket } from "mysql2/promise";
import express from "express";

class CategoryService {
  private db: Pool;
  constructor() {
    this.db = createDB();
  }

  public async getAllTasksOfCategory(
    req: express.Request,
    res: express.Response
  ) {
    try {
      const [
        result,
      ] = await this.db.query(
        "select T.* from Task as T, TaskCategoryMap as TCM where T.id = TCM.taskId and TCM.categoryId = ? ",
        [req.params.categoryId]
      );

      return res.status(200).json({
        status: 200,
        data: result,
      });
    } catch (err) {
      return res.status(400).json({ status: 400, message: err.message });
    }
  }
  public async getPointsOfCategory(
    req: express.Request,
    res: express.Response
  ) {
    try {
      const [[result]] = await this.db.query<RowDataPacket[]>(
        "select Sum(T.point) as sum  from Task as T, TaskCategoryMap as TCM, CompletedTask as CT where T.id = TCM.taskId and TCM.categoryId = ? and T.id = CT.taskId and DATE(CT.completedAt) =DATE(NOW())+1",
        [req.params.categoryId]
      );

      return res.status(200).json({
        status: 200,
        data: result.sum || 0,
      });
    } catch (err) {
      return res.status(400).json({ status: 400, message: err.message });
    }
  }

  public async getAll(req: express.Request, res: express.Response) {
    try {
      const [result] = await this.db.query("select * from Category");

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
        "insert into Category(label, emoji) values ?",
        [[[body.label, body.emoji]]]
      );

      return res.status(200).json({
        status: 200,
        data: result.insertId,
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
        "select * from Category where id = ?",
        [req.params.categoryId]
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

const categoryService = new CategoryService();
export { categoryService };
