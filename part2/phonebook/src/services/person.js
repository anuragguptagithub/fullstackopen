import axios from "axios";

const url = '/api/persons'

const getAll = () => {
    return ( axios
             .get(url)
             .then(response => response.data) )
}
const add = (person) => {
    return ( axios
            .post(url,person)
            .then(response => response.data) )
}
const update = (id,person) => {
    return ( axios
             .put(`${url}/${id}`,person)
             .then(response => response.data) )
    }

const remove = (id) => {
    return ( axios
             .delete(`${url}/${id}`)
             .then(response => response.data) )             
}

const personService = {
    getAll, 
    add, 
    update, 
    remove
  };

  export default personService
