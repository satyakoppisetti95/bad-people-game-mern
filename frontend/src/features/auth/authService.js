import axios from 'axios'

const API_URL = '/api/users/'

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL, userData)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + 'login', userData)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
  }

  return response.data
}

const getMe = async (token) => {
  const config = {
    headers: {
        Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.get(API_URL + 'me',config)
  if(response.data){
    const user = JSON.parse(localStorage.getItem('user'))
    user.game = response.data.game
    user.isInGame = response.data.isInGame
    localStorage.setItem('user', JSON.stringify(user))
  }
  return response.data
}

// Logout user
const logout = () => {
  console.log('logout')
  localStorage.removeItem('user')
}

const authService = {
  register,
  logout,
  login,
  getMe
}

export default authService