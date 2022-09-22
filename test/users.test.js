const bcrypt = require("bcrypt");
const User = require("../models/User");
const { api } = require("./helpers");
const moongose = require("mongoose");
const { server } = require("../index");

describe("Creating a new user", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("1234", 10);

    const newUser = new User({
      username: "cristian",
      name: "cristian",
      passwordHash,
    });
    await newUser.save();
  });

  test("works as expected creating a fresh username", async () => {
    const usersDB = await User.find({});
    const usersAtStart = usersDB.map((user) => user.toJSON());

    const newUser = {
      username: "cri",
      name: "cri",
      password: "qwe",
    };
    await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    const usersDBAfter = await User.find({});
    const userAtEnd = usersDBAfter.map((user) => user.toJSON());
    expect(userAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = userAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  afterAll(() => {
    moongose.connection.close();
    server.close();
  });
});
