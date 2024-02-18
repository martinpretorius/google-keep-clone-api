import express from "express";
import cors from "cors";
import { nanoid } from "nanoid";

const app = express();
app.use(express.json());
app.use(cors());

// set up basic express server running on port 5000
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

// create / route which runs as soon as app starts
app.get("/", (request, response) => {
    response.send("Welcome to my Google Keep Clone API server built with NodeJS and ExpressJS");
})

// create array of notes to store notes
const notes = [];

// get all notes saved locally in notes array
app.get("/api/notes", (req, res) => {
    res.send(notes)
});

// create note
app.post("/api/note", (req, res) => { 
    const { text } = req.body;

    if (!text) {
        return res.status(400).send("Note text is required!");
    }
    
    try {
        const note = {
            id: nanoid(),
            title: req.body.title,          
            text: text,
            color: "white"
        };

        notes.push(note);
        res.json(note);
    } catch (error) {
        res.status(500).send("Oops, something went wrong");
    }
});

// update note
app.patch("/api/note/:id", (req, res) => {
    const { text } = req.body;
    const id = req.params.id;
    const note = notes.find((note) => note.id === req.params.id);

    if (!text) {
        return res.status(400).send("Note text is required!");
    }
    
    if (!id) {
        return res.status(400).send("Please provide a note ID!");
    }
    
    if (!note) {
        return res.status(404).send("Note not found!");
    }

    try {
        note.title = req.body.title;          
        note.text = text;
        note.color = req.body.color;           
        res.json(note);
    } catch (error) {
        res.status(500).send("Oops, something went wrong");
    }   
})

// update note color only
app.patch("/api/note-color/:id", (req, res) => {
    const { color } = req.body;
    const id = req.params.id;
    const note = notes.find((note) => note.id === req.params.id);

    if (!color) {
        return res.status(400).send("Note color is required!");
    }
    
    if (!id) {
        return res.status(400).send("Please provide a note ID!");
    }
    
    if (!note) {
        return res.status(404).send("Note not found!");
    }

    try {        
        note.color = req.body.color;           
        res.json(note);
    } catch (error) {
        res.status(500).send("Oops, something went wrong");
    }   
})

// delete note
app.delete("/api/note/:id", (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).send("Please provide a note ID!");
    }

    const note = notes.find((note) => note.id === req.params.id);
    if (!note) {
        return res.status(404).send("Note not found!");
    }

    try {
        const index = notes.indexOf(note);
        notes.splice(index, 1);
        res.status(204).send();
    } catch (error) {
        res.status(500).send("Oops, something went wrong");
    }
})

