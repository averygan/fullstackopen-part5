import axios from 'axios'
const baseUrl = '/api/blogs'

const like = async (id, blogObject) => {
    const response = await axios.put(`${baseUrl}/${id}`, blogObject)
    return response.data
}

export default { like }