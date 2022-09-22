const { Schema, model } = require("mongoose");

const noteSchema = new Schema({
  content: String,
  date: Date,
  important: Boolean,
  user: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

// modificando la respuesta
noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Note = model("Note", noteSchema);

// const note = new Note({
//   content: "HTML is easy",
//   date: new Date(),
//   important: true,
// });

// note
//   .save()
//   .then((result) => {
//     console.log(result);
//     mongoose.connection.close();
//   })
//   .catch((e) => console.error(e));

// Note.find({})
//   .then((result) => {
//     console.log(result);
//     mongoose.connection.close();
//   })
//   .catch((e) => console.error(e));
module.exports = Note;
