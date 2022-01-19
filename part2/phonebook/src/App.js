import React, { useState, useEffect } from 'react'
import Person from './components/Person'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import personService from './services/person'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('Your Name...')
  const [newNumber, setNewNumber] = useState('+49..')
  const [filterText, setFilterText] = useState('')
  const [notificationText, setNotificationText] = useState(null)

  const hook = () => {
    personService
    .getAll()
    .then(persons => setPersons(persons))
  }
  useEffect(hook, [])

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    
/*     if( persons.some((person) => person.name === newName) ){
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        var updatePerson = persons.find(person => person.name === newName)
        updatePerson = {...updatePerson, number:newNumber}
        personService
        .update(updatePerson.id,updatePerson)
        .then(personResponse => { 
          setPersons(persons.map(person => person.id === updatePerson.id ? updatePerson : person))
          setNewName('')
          setNewNumber('')
        })
      }
      return
    } */

    const newPerson = {name: newName,number: newNumber}
    personService
      .add(newPerson)
      .then(personResponse => { 
        setPersons(persons.concat(personResponse))
        setNewName('')
        setNewNumber('')})
      .catch(error => {
        console.log(error.response.data)
        setNotificationText(error.response.data.error)
      })
  }
  
  const handleNameSearch = (event) => {
    console.log(event.target.value)
    setFilterText(event.target.value)
  }

  const deleteHandlerFunction = (deletePerson) => { 
    if(window.confirm(`Delete ${deletePerson.name} ?`)){
    personService
      .remove(deletePerson.id)
      .then(response => {
        console.log(response)
        setPersons(persons.filter(person => person.id !== deletePerson.id)) //causes rerender
      }) 
    }  
  }

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filterText.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationText} />
      <Filter filterText={filterText} handleNameSearch={handleNameSearch}/>
      <h3>Add a new </h3>
      <PersonForm handleSubmit={handleSubmit}
                  newName={newName} 
                  handleNameChange={handleNameChange} 
                  newNumber={newNumber} 
                  handleNumberChange={handleNumberChange}
                  />
      <h3>Numbers</h3>
      <ul>
        {filteredPersons.map(person => 
              <Person key={person.name}
                      person={person}
                      deleteHandler={ () => {deleteHandlerFunction(person)}} />)}
      </ul>

    </div>
  )
}

export default App