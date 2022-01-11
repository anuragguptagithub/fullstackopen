import React from "react";

const Filter = ({country,handleCountrySearch}) => {
    return (
        <div>
            find coutries<input value={country} onChange={handleCountrySearch}></input>
        </div>
    )
}

export default Filter