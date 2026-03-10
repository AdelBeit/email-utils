import express from "express";
import { generateEmails, bulkverification } from "../lib/emailfinder.js";

const app = express();

app.use(express.static("public"));
app.use("/modules", express.static("node_modules"));
app.use(express.json());

app.post("/find-emails", async (req, res) => {
  const { firstName, lastName, domain } = req.body;
  const generated = generateEmails(firstName, lastName, domain).split(",");
  try {
    let verified = await bulkverification(generated, domain);
    res.json({ verified, generated });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      error: "there was a problem",
      e: e,
      generated,
    });
  }
});

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3001;
const MAX_PORT_ATTEMPTS = 15;

const startServer = (port, attemptsLeft) => {
  const server = app.listen(port, () => console.log(`listening on ${port}`));

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.warn(`port ${port} already in use`);
      if (attemptsLeft > 0) {
        startServer(port + 1, attemptsLeft - 1);
      } else {
        console.error("no available ports found after repeated attempts");
        process.exit(1);
      }
    } else {
      console.error("unexpected server error", err);
      process.exit(1);
    }
  });
};

startServer(DEFAULT_PORT, MAX_PORT_ATTEMPTS);

export default app;
