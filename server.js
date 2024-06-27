const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

const PORT = process.env.PORT || 3500;

app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
