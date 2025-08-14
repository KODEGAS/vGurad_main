
// Update a note
export const updateNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const update = req.body;
    const note = await Note.findByIdAndUpdate(id, update, { new: true });
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error updating note', error });
  }
};

// Delete a note
export const deleteNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const note = await Note.findByIdAndDelete(id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    // Remove note from user's savedNotes array
    if (note.user_id) {
      await userModel.findByIdAndUpdate(
        note.user_id,
        { $pull: { savedNotes: note._id } }
      );
    }
    res.json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting note', error });
  }
};
import { Request, Response } from 'express';
import { Note } from '../models/note.model';
import { userModel } from '../models/User';

// Get all notes for a user
export const getNotes = async (req: Request, res: Response) => {
  try {
    const userId = req.query.user_id || req.body.user_id;
    if (!userId) return res.status(400).json({ message: 'user_id is required' });
    const notes = await Note.find({ user_id: userId }).sort({ created_at: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notes', error });
  }
};

// Create a new note
export const createNote = async (req: Request, res: Response) => {
  try {
    const note = new Note(req.body);
    await note.save();
    // Add note ObjectId to user's savedNotes array
    if (note.user_id) {
      await userModel.findByIdAndUpdate(
        note.user_id,
        { $push: { savedNotes: note._id } },
        { new: true }
      );
    }
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: 'Error saving note', error });
  }
};
