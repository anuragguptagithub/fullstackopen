import React, { useState, useEffect } from 'react'
import Note from './components/Note'
import noteService from './services/notes'
import Footer from './components/Footer'
import Notification from './components/Notification'



const App = (props) => {
  const [notes,setNotes] = useState([])
  const [newNote,setNewNote] = useState('')
  const [showAll,setShowAll] = useState(true)
  const [notificationMessage, setNotificationMessage] = useState(null)

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  const toggleImportanceOf = id => {
    
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
        setNotificationMessage(
          `Updated '${changedNote.content}'`
        )
        setTimeout(() => {
          setNotificationMessage(null)
          }, 2000)
      })
      .catch(error => {
        setNotificationMessage(
          `Note '${note.content}' was already removed from server`
        )
        setTimeout(() => {
          setNotificationMessage(null)
        }, 2000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }
  const addNote = (event) => {
    
    event.preventDefault()
    const noteObject = {
      content: newNote,
      date: new Date(),
      important: Math.random() < 0.5 
    }
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
        setNotificationMessage(
          `Added '${returnedNote.content}'`
        )
        setTimeout(() => {
          setNotificationMessage(null)
          }, 3000)
      })

  }

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const notesToShow = showAll
  ? notes
  : notes.filter(note => note.important )

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={notificationMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
         <Note 
           key={note.id}
           note={note}
           toggleImportance={()=> toggleImportanceOf(note.id)} />)}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App