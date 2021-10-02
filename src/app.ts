import express, { Request, Response, NextFunction } from "express";
import { swaggerUi, specs } from "./swagger";
import router from "./routes/index";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
// /**
//  * @swagger
//  *  /:
//  *    get:
//  *      tags:
//  *      - product
//  *      description: 모든 제품 조회
//  *      produces:
//  *      - application/json
//  *      responses:
//  *       200:
//  *        description: 제품 조회 성공
//  */
// app.get("/", (request: Request, response: Response, next: NextFunction) => {
//   response.send("hello");
// });

// app.post("/", (request: Request, response: Response, next: NextFunction) => {
//   response.send("hello");
// });

app.use(bodyParser.json());
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api", router);

export default app;
