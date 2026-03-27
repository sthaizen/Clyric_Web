import Note from "../models/Note.js";

export const getNotes = async (req, res) => {
  try {
    const userId = req.auth().userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { problemId } = req.params;
    const notes = await Note.find({ userId, problemId }).sort({ updatedAt: -1 });

    res.json({ success: true, notes });
  } catch (err) {
    console.error("getNotes error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createNote = async (req, res) => {
  try {
    const userId = req.auth().userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { problemId } = req.params;
    const note = await Note.create({
      userId,
      problemId,
      title: "New Note",
      content: "",
    });

    res.status(201).json({ success: true, note });
  } catch (err) {
    console.error("createNote error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateNote = async (req, res) => {
  try {
    const userId = req.auth().userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { noteId } = req.params;
    const { title, content } = req.body;

    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    await note.save();

    res.json({ success: true, note });
  } catch (err) {
    console.error("updateNote error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const userId = req.auth().userId;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { noteId } = req.params;
    const note = await Note.findOneAndDelete({ _id: noteId, userId });
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    res.json({ success: true });
  } catch (err) {
    console.error("deleteNote error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
