export const login = async userData => {
  const tokenId = ''
  const token = await localStorage.getItem(tokenId)
  const fetchOptions = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-type': 'application/json'
    },
    body: JSON.stringify(userData)
  }
  return await fetch(`http://localhost:8000/api/users/login`, fetchOptions)
    .then(res => res.json())
    .catch(() => ({
      error: { message: 'Unable to connect to server. Please try again' }
    }))
}
