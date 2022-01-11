import React from "react"; 
import CountryList from "./CountryList";

const Country = ({filteredCountries,filterText,handleClickShow}) => {
if(filteredCountries.length > 10 && filterText !== ""){
    return(<div>Please narrow down your search</div>)
}
if(filteredCountries.length === 1){
    return(
    <CountryList filteredCountries={filteredCountries}/>
    )
}
return(
<ul>
    {filteredCountries.map(country => 
    <li key={country.name.official.concat(country.maps.googleMaps)}>
        {country.name.common}<button value={country.name.common} onClick={handleClickShow}>show</button>
    </li>)}
</ul>
)
}

export default Country