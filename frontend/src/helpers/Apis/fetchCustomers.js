export const fetchCustomers = async userData => {
  const tokenId = ''
  const token = await localStorage.getItem(tokenId)
  const fetchOptions = {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-type': 'application/json'
    }
  }
  return await fetch(
    `http://localhost:8000/api/fetch-all-customers`,
    fetchOptions
  )
    .then(res => res.json())
    .catch(() => ({
      error: { message: 'Unable to connect to server. Please try again' }
    }))
}

export const fetchSearchedCustomers = async searchItem => {
  const tokenId = ''
  const token = await localStorage.getItem(tokenId)
  const fetchOptions = {
    method: 'Post',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ searchItem })
  }
  return await fetch(`http://localhost:8000/api/search-message`, fetchOptions)
    .then(res => res.json())
    .catch(() => ({
      error: { message: 'Unable to connect to server. Please try again' }
    }))
}
