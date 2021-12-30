export const fetchCustomerChats = async customerId => {
  const tokenId = ''
  const token = await localStorage.getItem(tokenId)
  const fetchOptions = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ customerId })
  }
  return await fetch(
    `http://localhost:8000/api/message/fetch-customer-messages`,
    fetchOptions
  )
    .then(res => res.json())
    .catch(() => ({
      error: { message: 'Unable to connect to server. Please try again' }
    }))
}

export const sendMessage = async messageDetails => {
  const tokenId = ''
  const token = await localStorage.getItem(tokenId)
  const fetchOptions = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-type': 'application/json'
    },
    body: JSON.stringify(messageDetails)
  }
  return await fetch(`http://localhost:8000/api/message/send`, fetchOptions)
    .then(res => res.json())
    .catch(() => ({
      error: { message: 'Unable to connect to server. Please try again' }
    }))
}

export const updateChatStatus = async ({
  chatId,
  customerId,
  event,
  isSatisfied,
  status
}) => {
  const tokenId = ''
  const token = await localStorage.getItem(tokenId)
  const fetchOptions = {
    method: 'PATCH',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ status, isSatisfied, chatId, customerId, event })
  }
  return await fetch(
    `http://localhost:8000/api/message/update-status`,
    fetchOptions
  )
    .then(res => res.json())
    .catch(() => ({
      error: { message: 'Unable to connect to server. Please try again' }
    }))
}

export const addAgentToCustomerChat = async (messageId, agentId) => {
  const tokenId = ''
  const token = await localStorage.getItem(tokenId)
  const fetchOptions = {
    method: 'PATCH',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ messageId, agentId })
  }
  return await fetch(
    `http://localhost:8000/api/message/add-agentId-to-message`,
    fetchOptions
  )
    .then(res => res.json())
    .catch(() => ({
      error: { message: 'Unable to connect to server. Please try again' }
    }))
}

export const sendEmailNotification = async (mail, title) => {
  const tokenId = ''
  const token = await localStorage.getItem(tokenId)
  const fetchOptions = {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ mail, title })
  }
  return await fetch(
    `http://localhost:8000/api/message/send-notification-mail`,
    fetchOptions
  )
    .then(res => res.json())
    .catch(() => ({
      error: { message: 'Unable to connect to server. Please try again' }
    }))
}
