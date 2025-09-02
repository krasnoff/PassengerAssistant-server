import express from "express";
import actionsController from "./controllers/actions.controller";

console.log('let the play begin...');

const server = express();

server.use(express.json());
server.use("/api", actionsController);

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
