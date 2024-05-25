import { useState, useEffect } from 'react';
import { getCollections } from '../backend/server';
import { auth } from '../firebaseConfig';

/**
* useCollections hook manages the state and fetching of user collections. It listens to the authentication state and loads collections accordingly.
* @function useCollections
* @param {string} userid - The user ID to fetch collections for.
* @returns {Object} An object containing collections array, loading state, and reloadCollections function.
*/
export function useCollections(userid) {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

  /**
  * Reloads the collections for the current user.
  * @async
  * @function reloadCollections
  * @returns {Promise<void>} A promise that resolves when collections are reloaded.
  */
  async function reloadCollections() {
    if (user && user.email) {
      setLoading(true);
      const data = await getCollections(user.email);
      setCollections(data || []);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user && user.email) {
      reloadCollections();
    }
  }, [user]);

  return {
    collections,
    loading,
    reloadCollections,
  };
}
