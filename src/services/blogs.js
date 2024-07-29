import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
let username = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}
const setUsername = newUsername => {
  username = newUsername
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const like = async (id, blogObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, blogObject)
  return response.data
}

const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: `${token}` }
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default { getAll, create, setToken, setUsername, like, deleteBlog}