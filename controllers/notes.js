const notesRouter = require("express").Router();
const Note = require("../models/Note");

notesRouter.get("/", (req, res) => {
  Note.find({}).then((note) => {
    res.send(note);
  });
});

notesRouter.post("/", (req, res) => {
  const { content, important } = req.body;
  if (content === undefined) return res.status(400).json({ error: "error" });
  const newNote = new Note({
    content: content,
    date: new Date(),
    important: important,
  });
  newNote.save().then((savedNote) => res.send(savedNote));
});

notesRouter.get("/:id", (req, res, next) => {
  const { id } = req.params;
  Note.findById(id)
    .then((note) => {
      if (note) {
        res.send(note);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

notesRouter.put("/:id", (req, res, next) => {
  const { id } = req.params;
  const body = req.body;
  Note.findByIdAndUpdate(id, body, { new: true })
    .then((note) => res.send(note))
    .catch((error) => next(error));
});

notesRouter.delete("/:id", (req, res, next) => {
  const { id } = req.params;
  Note.findByIdAndDelete(id)
    .then(() => res.status(204).end())
    .catch((error) => next(error));
});

module.exports = notesRouter;
