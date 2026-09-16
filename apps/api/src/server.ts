import "./config/env.js";

console.log("cwd:", process.cwd());
console.log("PORT:", process.env.PORT);
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
console.log("API_URL:", process.env.API_URL);

import app from "./app.js";

const PORT = process.env.PORT || 3000;

app.get("/", (_,res) => {
	res.send("UTOWN API is running");
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});