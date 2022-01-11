import React, { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]
  
  const random = (max) => {
    return Math.floor(Math.random() * max);
  }

  const [selected, setSelected] = useState(0)

  let votes_init = [0,0,0,0,0,0,0]
  const [votes, setVotes] = useState(votes_init)


  const setRandom = () => {
    const random_anecdote_index = random(anecdotes.length)
    setSelected(random_anecdote_index)
  }

  const setNewVotes = () => {
    const newVotes = [...votes]
    newVotes[selected] += 1
    setVotes(newVotes) 
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}<br/>
      has {votes[selected]} votes<br/></p>
      <button onClick={setNewVotes}>vote</button>
      <button onClick={setRandom}>next anecdote</button>
      <br/>
      <br/>
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[votes.indexOf(Math.max(...votes))]}<br/>
      has {Math.max(...votes)} votes</p>
    </div>
  )
}

export default App