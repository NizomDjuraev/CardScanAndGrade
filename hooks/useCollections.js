import { useState, useEffect } from 'react';
import { getCollections } from '../backend/supabase';


/**
 * Hook for fetching and managing the state of collections from the backend
 * It handles the loading state and fetching of collections based on the provided user ID. This hook contains
 * the logic for loading, reloading, and maintaining the state of the collections.
 * 
 * @param {string} userid The user ID for which collections are to be fetched.
 * @returns {Object} An object containing the collections array, a loading boolean indicating the fetch status,
 * and a function to reload collections, allowing for manual refresh of the data.
 */
export function useCollections(userid) {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  async function reloadCollections() {
    setLoading(true);
    const data = await getCollections(userid);
    setCollections(data);
    setLoading(false);
  }

  useEffect(() => {
    reloadCollections();
  }, [userid]);

  return {
    collections,
    loading,
    reloadCollections,
  };
}
