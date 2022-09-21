const express = require('express');
const path = require('path');
const fs = require('fs');

// const uuid = require('./helpers/uuid'); //to check if can use to id notes for deleting purpose
const txtNotes = require('./db/db.json');

const PORT = 3001;

const app = express();

// const txtNotes = require('./db/db.json');

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//GET route for public folder
app.use(express.static('public'));

//GET notes
app.get('/api/notes', (req, res) => {
    res.json(txtNotes);
});

//route to set up homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

//create notes function
function addToNotes(body, currentNotes) {
    const newNote = body;
    

    //checking to see if currentNotes is not array, if not array make it an array
    if (!Array.isArray(currentNotes)) 
        currentNotes = [];
    
    if (currentNotes.length === 0)
    { let currentNotes = []; 
        currentNotes.push(0);}

    
    currentNotes.push(newNote);
    fs.writeFile(path.join(__dirname, './db/db.json'), 
            JSON.stringify(currentNotes), (err) => 
     err
        ? console.error(err)
        : console.log ('Notes has been added')
    );
    return newNote;
}

//posting (create) notes
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);

    const newNote = addToNotes(req.body, txtNotes);
    res.json(newNote);
});


//listening for port
app.listen(PORT, () => {
    console.log(`Listening to API server on port ${PORT}.`);
});