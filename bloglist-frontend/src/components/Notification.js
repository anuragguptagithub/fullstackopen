import React from "react"

const Notification = ({ message }) => {
    if (message === null) {
      return null
    }
    const color =  message.includes('Added') || message.includes('Updated') || message.includes('created')  ? 'green':'red' ;
    const notificationStyle = {
        color: color,
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
      }

    return (
      <div style={notificationStyle} className='notification'>
        {message}
      </div>
    )
  }

  export default Notification