import { useState, useEffect } from 'react';
import { getCurrentUserId } from '@/lib/getCurrentUserId';
import { fetchMongoUserProfile } from '@/lib/fetchMongoUserProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Edit, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollAnimatedSection } from '../ScrollAnimatedSection';

interface Note {
  id: string;
  title: string;
  content: string;
  category?: string;
  created_at: string;
  updated_at: string;
}

export const SavedNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [mongoUserId, setMongoUserId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const [noteForm, setNoteForm] = useState({
    title: '',
    content: '',
    category: '',
  });


  useEffect(() => {
    const fetchProfileAndNotes = async () => {
      const userId = getCurrentUserId();
      if (!userId) return;
      try {
        const profile = await fetchMongoUserProfile();
        if (profile && profile._id) {
          setMongoUserId(profile._id);
          await fetchNotes(profile._id);
        }
      } catch (e) {
        setLoading(false);
      }
    };
    fetchProfileAndNotes();
  }, []);



  const fetchNotes = async (mongoUserIdParam?: string) => {
    try {
      const id = mongoUserIdParam || mongoUserId;
      if (!id) throw new Error('User not logged in');
      const res = await fetch(`http://localhost:5001/api/notes?user_id=${id}`);
      if (!res.ok) throw new Error('Failed to fetch notes');
      const data = await res.json();
  // Map backend _id to id for frontend
  setNotes((data || []).map((n: any) => ({ ...n, id: n._id })));
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast({
        title: "Error",
        description: "Failed to load your notes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveNote = async () => {
    try {
      if (!mongoUserId) return;
      if (!noteForm.title || !noteForm.content) {
        toast({
          title: "Error",
          description: "Please fill in title and content",
          variant: "destructive",
        });
        return;
      }

      if (editingNote) {
        // Update existing note
        const res = await fetch(`http://localhost:5001/api/notes/${editingNote.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: noteForm.title,
            content: noteForm.content,
            category: noteForm.category || undefined,
          }),
        });
        if (!res.ok) throw new Error('Failed to update note');
        const updated = await res.json();
  setNotes(notes.map(n => n.id === editingNote.id ? { ...updated, id: updated._id } : n));
        toast({
          title: "Success",
          description: "Note updated successfully",
        });
      } else {
        // Create new note
        const res = await fetch('http://localhost:5001/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: mongoUserId,
            title: noteForm.title,
            content: noteForm.content,
            category: noteForm.category || undefined,
          }),
        });
        if (!res.ok) throw new Error('Failed to save note');
        const data = await res.json();
  setNotes([{ ...data, id: data._id }, ...notes]);
        toast({
          title: "Success",
          description: "Note saved successfully",
        });
      }

      setNoteForm({ title: '', content: '', category: '' });
      setShowAddForm(false);
      setEditingNote(null);
    } catch (error) {
      console.error('Error saving note:', error);
      toast({
        title: "Error",
        description: editingNote ? "Failed to update note" : "Failed to save note",
        variant: "destructive",
      });
    }
  };

  const deleteNote = async (noteId: string) => {
    try {
      const res = await fetch(`http://localhost:5001/api/notes/${noteId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete note');
      setNotes(notes.filter(note => note.id !== noteId));
      toast({
        title: "Success",
        description: "Note deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Error",
        description: "Failed to delete note",
        variant: "destructive",
      });
    }
  };

  const startEdit = (note: Note) => {
    setNoteForm({
      title: note.title,
      content: note.content,
      category: note.category || '',
    });
    setEditingNote(note);
    setShowAddForm(true);
  };

  const cancelEdit = () => {
    setNoteForm({ title: '', content: '', category: '' });
    setEditingNote(null);
    setShowAddForm(false);
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (note.category && note.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">My Saved Notes</h3>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4 mr-2" />
          New Note
        </Button>
      </div>

      {showAddForm && (
        <ScrollAnimatedSection animationType="fade-up">
          <Card>
            <CardHeader>
              <CardTitle>{editingNote ? 'Edit Note' : 'Create New Note'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="note-title">Title</Label>
                  <Input
                    id="note-title"
                    value={noteForm.title}
                    onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                    placeholder="Enter note title"
                  />
                </div>
                <div>
                  <Label htmlFor="note-category">Category</Label>
                  <Input
                    id="note-category"
                    value={noteForm.category}
                    onChange={(e) => setNoteForm({ ...noteForm, category: e.target.value })}
                    placeholder="Enter category (optional)"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="note-content">Content</Label>
                <Textarea
                  id="note-content"
                  value={noteForm.content}
                  onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                  placeholder="Enter your note content..."
                  rows={6}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={saveNote}>
                  {editingNote ? 'Update Note' : 'Save Note'}
                </Button>
                <Button variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </ScrollAnimatedSection>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Notes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search notes by title, content, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {filteredNotes.map((note, index) => (
          <ScrollAnimatedSection 
            key={note.id} 
            animationType="fade-up" 
            delay={index * 100}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold">{note.title}</h4>
                      {note.category && (
                        <Badge variant="outline">{note.category}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                      {note.content}
                    </p>
                    <div className="text-xs text-muted-foreground">
                      <p>Created: {new Date(note.created_at).toLocaleDateString()}</p>
                      {note.updated_at !== note.created_at && (
                        <p>Updated: {new Date(note.updated_at).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEdit(note)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteNote(note.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollAnimatedSection>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <ScrollAnimatedSection animationType="fade-up">
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {searchTerm ? 'No notes found matching your search.' : 'No notes saved yet. Create your first note to get started!'}
              </p>
            </CardContent>
          </Card>
        </ScrollAnimatedSection>
      )}
    </div>
  );
};