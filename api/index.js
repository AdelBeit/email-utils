import express from "express";
import { generateEmails, bulkverification } from "../lib/emailfinder.js";

const app = express();

app.use(express.static("public"));
app.use(express.json());

app.post("/find-emails", async (req, res) => {
  const { firstName, lastName, domain } = req.body;
  try {
    let emails = await bulkverification(
      generateEmails(firstName, lastName, domain).split(","),
      domain
    );
    res.json({ emails });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: "there was a problem", e: e });
  }
});

app.listen(3001, ()=>console.log('listening on 3001'));

export default app;