import React, { useState, useEffect, useRef } from 'react'
import Note from './components/Note'
import noteService from './services/notes'
import Footer from './components/Footer'
import Notification from './components/Notification'
import loginService from './services/login'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import NoteForm from './components/NoteForm'


const App = (props) => {
  const [notes,setNotes] = useState([])
  const [showAll,setShowAll] = useState(true)
  const [notificationMessage, setNotificationMessage] = useState(null)

  const [user, setUser] = useState(null)

  const noteFormRef = useRef()

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
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

  const addNote = (noteObject) => {
   
    noteService
      .create(noteObject)
      .then(returnedNote => {
        noteFormRef.current.toggleVisibility()
        setNotes(notes.concat(returnedNote))
        setNotificationMessage(
          `Added '${returnedNote.content}'`
        )
        setTimeout(() => {
          setNotificationMessage(null)
          }, 3000)
      })
      .catch(error => {
        setNotificationMessage(
          `Error occurred saving note : ${error.message}`
        )
        setTimeout(() => {
          setNotificationMessage(null)
          }, 3000)
      })

  }

  const notesToShow = showAll
  ? notes
  : notes.filter(note => note.important )

  const handleLogin = async ({username, password}) => {
    
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )          
      noteService.setToken(user.token)
      setUser(user)

    } catch (exception) {
      setNotificationMessage('Wrong credentials')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <Togglable buttonLabel="log in">
      <LoginForm handleLogin={handleLogin} />
    </Togglable>
  )

  const noteForm = () => (
    <Togglable buttonLabel="new note" ref={noteFormRef}>
      <NoteForm createNote={addNote} />
    </Togglable>
  )

  return (
    <div>
      <h1>Notes</h1>
      
      <Notification message={notificationMessage} />

      {
      user === null ?
      loginForm() 
      :
        <div>
        <p>{user.name} logged-in</p>
        {noteForm()}
      </div>
      }

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

      <Footer />
    </div>
  )
}

export default App