import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [notes, setNotes] = useState([]);

  // Fetch notes on mount
  useEffect(() => {
    async function fetchNotes() {
      try {
        const res = await fetch(`${API_URL}/notes`);
        if (!res.ok) throw new Error("Failed to fetch notes");
        const data = await res.json();
        setNotes(data);
      } catch (err) {
        console.error("Error fetching notes:", err);
      }
    }
    fetchNotes();
  }, []);

  // Add new note to backend and state
  async function addNote(note) {
    try {
      const res = await fetch(`${API_URL}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
      });
      if (!res.ok) throw new Error("Failed to create note");
      const created = await res.json();
      setNotes(prev => [created, ...prev]); // newest first
    } catch (err) {
      console.error("Error adding note:", err);
    }
  }

  // Delete note from backend and state
  async function deleteNote(id) {
    try {
      const res = await fetch(`${API_URL}/notes/${id}`, {
        method: "DELETE",
      });
      if (res.status === 204) {
        setNotes(prev => prev.filter(n => n.id !== id));
      } else {
        throw new Error("Failed to delete note");
      }
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  }

  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {notes.map(note => (
        <Note
          key={note.id}
          id={note.id}
          title={note.title}
          content={note.content}
          onDelete={deleteNote}
        />
      ))}
      <Footer />
    </div>
  );
}

export default App;
