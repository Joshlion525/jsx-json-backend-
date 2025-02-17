import express from "express";
import mongoose from "mongoose";
import UserRouter from "./routes/users.mjs";
import cors from "cors";

const app = express();

mongoose
	.connect("mongodb://localhost/jsx-json(backend)")
	.then(() => console.log("connected to database"))
	.catch((err) => console.log(`Error: ${err}`));

app.use(express.json.apply());
app.use(
	cors({
		origin: "http://localhost:5173",
		methods: "GET,POST,PUT,DELETE",
		allowedHeaders: "Content-Type,Authorization",
	})
);

app.use(UserRouter);

const PORT = process.env.PORT || 3000;

app.get("/", (request, response) => {
	response.status(200).send({ msg: "Hello" });
});

app.listen(PORT, () => {
	console.log(`Running on port ${PORT}`);
});
