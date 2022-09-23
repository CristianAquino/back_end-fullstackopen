const { app } = require("../index");
const supertest = require("supertest");
const api = supertest(app);
const initialNotes = [
  {
    content: "HTML is easy",
    date: new Date(),
    important: true,
  },
  {
    content: "Browser can execute only Javascript",
    date: new Date(),
    important: false,
  },
  {
    content: "GET and POST are the most important methods of HTTP protocol",
    date: new Date(),
    important: true,
  },
];
module.exports = { api, initialNotes };
