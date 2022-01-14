export const logoutAPI = async userData => {
  const tokenId = 'user-token'
  const token = await localStorage.getItem(tokenId)
  const fetchOptions = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-type': 'application/json'
    }
  }
  return await fetch(`http://localhost:8000/api/users/logout`, fetchOptions)
    .then(res => res.json())
    .catch(() => ({
      error: { message: 'Unable to connect to server. Please try again' }
    }))
}
