const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const path = require("path");
const fsPromises = require("fs").promises;
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { username, pwd } = req.body;
  if (!username || !pwd) {
    return res
      .status("400")
      .json({ message: "Useraname and password are required" });
  }
  const duplicate = usersDB.users.find(
    (person) => person.username === username
  );
  if (duplicate) {
    return res.status("409").json({ message: "Username already exists." });
  }
  try {
    const hashedPwd = await bcrypt.hash(pwd, 10);
    const newUser = {
      uername: username,
      password: hashedPwd,
    };
    usersDB.setUsers([...usersDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(usersDB.users)
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
