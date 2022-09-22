const moongose = require("mongoose");
const { server } = require("../index");
const Note = require("../models/Note");
const { api, initialNotes } = require("./helpers");

beforeEach(async () => {
  await Note.deleteMany({});
  const note1 = new Note(initialNotes[0]);
  await note1.save();
  const note2 = new Note(initialNotes[1]);
  await note2.save();
  const note3 = new Note(initialNotes[2]);
  await note3.save();
});

test("notes are returned as json", async () => {
  await api
    .get("/api/notes")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("there are two notes", async () => {
  const response = await api.get("/api/notes");
  expect(response.body).toHaveLength(initialNotes.length);
});

test("the first about HTML", async () => {
  const response = await api.get("/api/notes");
  const contents = response.body.map((note) => note.content);
  expect(contents).toContain("HTML is easy");
});

test("a valid note can be added", async () => {
  const newNote = {
    content: "Async/Awai",
    important: true,
  };

  await api
    .post("/api/notes")
    .send(newNote)
    .expect(200)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/notes");
  const contents = response.body.map((note) => note.content);
  expect(contents).toContain(newNote.content);
});

test("note without content is not added", async () => {
  const newNote = {
    important: true,
  };

  await api
    .post("/api/notes")
    .send(newNote)
    .expect(400)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/notes");
  expect(response.body).toHaveLength(initialNotes.length);
});

afterAll(() => {
  moongose.connection.close();
  server.close();
});
