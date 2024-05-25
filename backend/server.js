import "react-native-url-polyfill/auto"

const API_URL = 'https://igny4fore0.execute-api.us-east-1.amazonaws.com/test';

/**
 * Creates a new collection for a user.
 * @async
 * @function createCollection
 * @param {string} userId - The user's unique identifier.
 * @param {string} firstName - The user's first name.
 * @param {string} lastName - The user's last name.
 * @param {string} collectionName - The name of the collection to be created.
 * @returns {Promise<Object|null>} The created collection data or null if an error occurred.
 */
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


/**
* Fetches collections for a specific user.
* @async
* @function getCollections
* @param {string} userId - The user's unique identifier.
* @returns {Promise<Object[]|null>} An array of collections or null if an error occurred.
*/
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
