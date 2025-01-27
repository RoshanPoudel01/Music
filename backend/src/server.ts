import cors from "cors";
import express from "express";
import { createUserTable } from "./database/models/users";
import routers from "./routers";
const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;
// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello, Express with TypeScript!");
// });
createUserTable();
app.use("/api", routers);
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
