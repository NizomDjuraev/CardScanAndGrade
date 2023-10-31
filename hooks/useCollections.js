import { useState, useEffect } from 'react';
import { getCollections } from '../backend/supabase';

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
