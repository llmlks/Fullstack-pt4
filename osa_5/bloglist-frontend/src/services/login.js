import axios from 'axios'
const baseUrl = 'api/login'

const login = async (loginInfo) => {
    const response = await axios.post(baseUrl, loginInfo)
    return response.data
}

export default { login }