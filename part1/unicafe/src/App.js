import React, { useState } from 'react'

const Button = ({handleClick, text}) => {
  return(
  <button onClick={handleClick}>
    {text}
  </button>)
}
const StatisticLine = ({text,value}) => {
  return(
  <tr>
    <td>
    {text} {value}
    </td>
  </tr>  )
}

const Statistic = ({good, neutral, bad}) => {
  if(good === 0 && neutral === 0 && bad === 0){
    return(
      <>
      <h1>statistics</h1>
      <p>No feedback given</p>
      </>
    )
  }

  return(      
    <>
    <h1>statistics</h1>
    <table><tbody>
    <StatisticLine text="good" value={good}/>
    <StatisticLine text="neutral" value={neutral}/>
    <StatisticLine text="bad" value={bad}/>
    <StatisticLine text="all" value={good + neutral + bad}/>
    <StatisticLine text="average" value={ ( good * 1 + neutral * 0 + bad * -1 )/(good + neutral + bad )}/>
    <StatisticLine text="positive" value={ good/(good + neutral + bad )}/> 
 
    </tbody></table>
    </>)
}
const App = () => {
  // save clicks of each button to its own state

  const [clicks, setClicks] = useState({good:0,neutral:0,bad:0})
  const handleGood = () => {
    setClicks({...clicks, good: clicks.good + 1})
  }
  const handleNeutral = () => {
    setClicks({...clicks, neutral: clicks.neutral + 1})
  }
  const handleBad = () => {
    setClicks({...clicks, bad: clicks.bad + 1})
  }
  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick = {handleGood} text="good"/>
      <Button handleClick = {handleNeutral} text="neutral"/>
      <Button handleClick = {handleBad} text="bad"/>
      <Statistic good = {clicks.good} neutral ={clicks.neutral} bad = {clicks.bad} />
    </div>
  )
}

export default App