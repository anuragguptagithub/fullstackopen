import React, { useState, useEffect } from 'react'
import Filter from './components/Filter';
import Country from './components/Country';
import axios from 'axios'

const App = () => {

const[countries,setCountries] = useState([])
const[filterText, setFilterText] = useState('')

useEffect(() => {
axios
.get("https://restcountries.com/v3.1/all")
.then(response => {
  setCountries(response.data)
} )

},[])

const handleCountrySearch = (event) => {
setFilterText(event.target.value)
}

const handleClickShow = (event) => {
  setFilterText(event.target.value)
}
const filteredCountries = countries.filter(country => country.name.common.toLowerCase().includes(filterText.toLowerCase()))

return(
<div>
<Filter filterText={filterText} handleCountrySearch={handleCountrySearch}/>
<Country filteredCountries={filteredCountries} filterText={filterText} handleClickShow={handleClickShow}/>
</div>)
}
export default App;
