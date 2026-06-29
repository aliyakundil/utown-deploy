import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";

const PORT = process.env.PORT || 3000;

app.get("/", (_,res) => {
	res.send("UTOWN API is running");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});