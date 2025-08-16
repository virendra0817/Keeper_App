import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";

const API_URL = import.meta.env.VITE_API_URL; // 🔑 Use env variable

function App() {
  const [notes, setNotes] = useState([]);

  // Fetch notes from backend on first render
  useEffect(() => {
    fetch(`${API_URL}/notes`)
      .then((res) => res.json())
      .then((data) => setNotes(data))
      .catch((err) => console.error("Error fetching notes:", err));
  }, []);

  // Add new note to state
  function addNote(newNote) {
    setNotes((prevNotes) => [...prevNotes, newNote]);
  }

  // Delete note from state and backend
  async function deleteNote(id) {
    try {
      const response = await fetch(`${API_URL}/notes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete note");
      }

      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  }

  return (
    <div>
      <Header />
      <CreateArea onAdd={addNote} />
      {notes.map((noteItem) => (
        <Note
          key={noteItem.id}
          id={noteItem.id}
          title={noteItem.title}
          content={noteItem.content}
          onDelete={deleteNote}
        />
      ))}
      <Footer />
    </div>
  );
}

export default App;
