import express from "express";
import routes from "./src/routes/gameRoutes";
import mongoose from "mongoose";
import bodyParser from "body-parser";

const app = express();
const PORT = 6000;

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:37017/CardGameDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

routes(app);

app.get("/", (req, res) => res.send(`The Game is on /decks URI`));

app.listen(PORT, () =>
  console.log(`SENT SOME POST for server running on ${PORT}`)
);
