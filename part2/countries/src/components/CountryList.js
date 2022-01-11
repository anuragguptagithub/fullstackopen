import React, { useEffect } from "react"; 
import axios from 'axios';
import { useState } from 'react';

const CountryList = ({filteredCountries}) => {

const[weather, setWeather] = useState({})

useEffect( () => {
 const [ lat,lon ] = [ filteredCountries[0].capitalInfo.latlng[0] , filteredCountries[0].capitalInfo.latlng[1] ]
 const api_key = process.env.REACT_APP_API_KEY
 const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`
 axios
 .get(url)
 .then(response => { 
   setWeather(response.data) })
 },[] )

    return(    
    <div>
        <h2>{filteredCountries[0].name.common}</h2>
        <div>capital {filteredCountries[0].capital}</div>
        <div>population {filteredCountries[0].population}</div>
        <div>
        <h3>languages</h3>
        <ul>
           {Object.values(filteredCountries[0].languages).map(value => <li key={value} >{value}</li>)}
        </ul>
        <h3>Weather in {filteredCountries[0].capital[0]}</h3>
        <div><b>temperature is:</b> {weather?.main?.temp} Celsius</div>
        <div><img alt="Sky view" src={weather?.weather?.icon} height="50" width="50"/></div>
        <div><b>wind:</b>{weather?.wind?.speed} mph direction {weather?.wind?.speed}</div>
        </div>
    </div>
 )
}
export default CountryList