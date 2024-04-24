import "react-native-url-polyfill/auto"

const API_URL = 'https://igny4fore0.execute-api.us-east-1.amazonaws.com/test';
// https://igny4fore0.execute-api.us-east-1.amazonaws.com/test/collections?userId=5

export async function createCollection(userId, firstName, lastName, collectionName) {
  const response = await fetch(`${API_URL}/collections`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          userId,
          firstName,
          lastName,
          collectionName
      })
  });

  if (!response.ok) {
      console.error('Error creating collection:', response.statusText);
      return null;
  }

  return await response.json();
}


export async function getCollections(userId) {
  const response = await fetch(`${API_URL}/collections?userId=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json'
      }
  });

  if (!response.ok) {
      console.error('Error fetching collections:', response.statusText);
      return null;
  }

  return await response.json();
}
