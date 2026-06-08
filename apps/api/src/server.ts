import express from "express";

const app = express();

app.get("/", (_,res) => {
	res.send("UTOWN API is running");
});

app.listen(3001, () => {
	console.log("Server started on port 3001");
});