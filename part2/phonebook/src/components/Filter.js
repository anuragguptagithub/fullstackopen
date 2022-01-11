import React from 'react';

const Filter = ({filterText,handleNameSearch}) => {
    return(
    <div>filter show with <input value={filterText} onChange={handleNameSearch}/></div>
    )
    }

export default Filter