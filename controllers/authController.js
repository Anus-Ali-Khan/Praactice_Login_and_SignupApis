const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const path = require("path");
const fsPromises = require("fs").promises;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const handleLogin = async (req, res) => {
  const { username, pwd } = req.body;
  if (!username || !pwd) {
    return res
      .status(400)
      .json({ message: "Username and password is required" });
  }

  const foundUser = usersDB.users.find(
    (person) => person.username === username
  );
  if (!foundUser) {
    return res.status(400).json({ message: "User does not exist" });
  }
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    const accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN,
      { expiresIn: "1d" }
    );
    const currentUser = { ...foundUser };
    const otherUsers = usersDB.users.filter(
      (person) => person.username != username
    );

    usersDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );
    return res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
