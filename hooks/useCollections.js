import { useState, useEffect } from 'react';
import { getCollections } from '../backend/server';
import { auth } from '../firebaseConfig';

export function useCollections(userid) {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return () => unsubscribe();
  }, []);

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
