import app from "./app";
import awsServerlessExpress from "aws-serverless-express";
import { taskService } from "./service/taskService";

const server = awsServerlessExpress.createServer(app);
const handler = (event: any, context: any) => {
  if (event.id === "ecc08f3a-89f2-fa9e-f35e-ccdc30c892b5") {
    console.log("Scheduled Event!!");
    taskService.createRandomIndexs(5);
    return;
  }
  return awsServerlessExpress.proxy(server, event, context);
};

export { handler };
