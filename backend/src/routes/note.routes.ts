import { Router } from 'express';
import { getNotesByUser, createNote, deleteNote } from '../controllers/note.controller';

const router = Router();

router.get('/', getNotesByUser);
router.post('/', createNote);
router.delete('/:id', deleteNote);

export default router;
