import { Request, Response } from 'express';
import { Note } from '../models/note.model';
import { userModel } from '../models/User';

// Get all notes for a user
export const getNotesByUser = async (req: Request, res: Response) => {
  try {
    const userId = req.query.user_id || req.body.user_id;
    if (!userId) return res.status(400).json({ message: 'user_id is required' });
    const notes = await Note.find({ user_id: userId }).sort({ created_at: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notes', error: err });
  }
};

// Create new note
export const createNote = async (req: Request, res: Response) => {
  try {
    const note = new Note(req.body);
    const savedNote = await note.save();
    
    // Add note ObjectId to user's savedNotes array
    if (note.user_id) {
      await userModel.findByIdAndUpdate(
        note.user_id,
        { $push: { savedNotes: savedNote._id } },
        { new: true }
      );
    }

    res.status(201).json(savedNote);
  } catch (err) {
    res.status(500).json({ message: 'Error creating note', error: err });
  }
};

// Delete note
export const deleteNote = async (req: Request, res: Response) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    
    // Remove note from user's savedNotes array
    if (note.user_id) {
      await userModel.findByIdAndUpdate(
        note.user_id,
        { $pull: { savedNotes: note._id } },
        { new: true }
      );
    }

    res.json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting note', error: err });
  }
};
