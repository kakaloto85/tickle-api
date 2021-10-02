import app from "./app";
import awsServerlessExpress from "aws-serverless-express";

const server = awsServerlessExpress.createServer(app);
const handler = (event: any, context: any) => {
  return awsServerlessExpress.proxy(server, event, context);
};

export { handler };
