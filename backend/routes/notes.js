const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const router = express.Router();
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

// Route 1: fetch user notes  no login required at /api/notes/fetchusernotes

router.get("/fetchusernotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server error");
  }
});

// ROUTE 2: Add a new Note using: POST "/api/auth/addnote". Login required
router.post(
  "/addnote",
  fetchuser,
  [
    body("title", "Enter a valid title").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;

      // If there are errors, return Bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();

      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 3: update  Note using: PUT "/api/auth/updatenote". Login required

router.put("/updatenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    const newnote = {};

    if (title) {
      newnote.title = title;
    }
    if (description) {
      newnote.description = description;
    }
    if (tag) {
      newnote.tag = tag;
    }

    //check if the user exists in the database.
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not found");
    }

    //check if the user owns the note .
    if (note.user.toString() !== req.user.id) {
      return res.status(400).send("Not allowed");
    }

    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newnote },
      { new: true }
    );
    res.send(note);
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .send("Internal server error : dude can't able to update the note");
  }
});

// ROUTE 4: delete Note using: PUT "/api/auth/deletenote". Login required

router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    const { title, description, tag } = req.body;

    //check if the user exists in the database.
    let note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not found");
    }

    //check if the user owns the note.
    if (note.user.toString() !== req.user.id) {
      return res.status(400).send("Not allowed");
    }

    //delete the note.
    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ success: "note deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .send("Internal server error : dude can't able to update the note");
  }
});

module.exports = router;
