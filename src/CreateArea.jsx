import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function CreateArea({ onAdd }) {
  const [isExpanded, setExpanded] = useState(false);
  const [note, setNote] = useState({ title: "", content: "" });

  function handleChange(event) {
    const { name, value } = event.target;
    setNote(prev => ({ ...prev, [name]: value }));
  }

  function expand() {
    setExpanded(true);
  }

  async function submitNote(event) {
    event.preventDefault();
    if (!note.title.trim()) return; // title required

    try {
      const res = await fetch(`${API_URL}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note)
      });
      if (!res.ok) throw new Error("Failed to save note");
      const saved = await res.json();
      onAdd(saved);            // add saved note with real ID
    } catch (err) {
      console.error("Error saving note:", err);
    } finally {
      setNote({ title: "", content: "" });
      setExpanded(false);
    }
  }

  return (
    <div>
      <form className="create-note">
        {isExpanded && (
          <input
            name="title"
            onChange={handleChange}
            value={note.title}
            placeholder="Title"
            autoFocus
          />
        )}
        <textarea
          name="content"
          onClick={expand}
          onChange={handleChange}
          value={note.content}
          placeholder="Take a note..."
          rows={isExpanded ? 3 : 1}
        />
        <Zoom in={isExpanded}>
          <Fab onClick={submitNote} aria-label="Add">
            <AddIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
}

export default CreateArea;
