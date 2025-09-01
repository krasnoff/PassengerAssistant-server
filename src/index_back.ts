import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// Middlewares
app.use(express.json());

// Routes
app.get("/", (_req: Request, res: Response) => {
  res.json({ ok: true, message: "Hello from TypeScript + Express 👋" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
