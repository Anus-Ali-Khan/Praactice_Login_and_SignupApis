const express = require("express");
const app = express();
const PORT = process.env.PORT || 3500;

app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
