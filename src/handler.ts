import app from "./app";
import awsServerlessExpress from "aws-serverless-express";
import { taskService } from "./service/taskService";

const server = awsServerlessExpress.createServer(app);
const handler = (event: any, context: any) => {
  console.log(event);
  if (event.source === "aws.events") {
    console.log("Scheduled Event!!");
    taskService.createRandomIndexs(5);
    return;
  }
  return awsServerlessExpress.proxy(server, event, context);
};

export { handler };
