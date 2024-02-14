import "react-native-url-polyfill/auto"
import { createClient } from "@supabase/supabase-js"


const supabaseUrl = 'https://zrjswhazqjmxcwqlxsnj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyanN3aGF6cWpteGN3cWx4c25qIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg3Njc2MzUsImV4cCI6MjAxNDM0MzYzNX0.8L-faWju0jWXWMD3VXKpOMqHmWet2mU59AeLwCXqfVg';

/**
 * The Supabase client instance.
 * @type {SupabaseClient}
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Creates a new collection in the usercollections table.
 * @param {string} userId - The user's unique identifier.
 * @param {string} firstName - The user's first name.
 * @param {string} lastName - The user's last name.
 * @param {string} collectionName - The name of the new collection.
 * @returns {Promise<Object|null>} The created collection data, or null in case of an error.
 */
export async function createCollection(userId, firstName, lastName, collectionName) {
    const { data, error } = await supabase
      .from('usercollections')
      .insert([
        {
          userid: userId,
          firstname: firstName,
          lastname: lastName,
          collection: collectionName
        }
      ]);
    if (error) {
      console.error('Error creating collection:', error);
      return null;
    }
    return data;
  }


/**
 * Fetches all collections for a given user.
 * @param {string} userid - The user's unique identifier.
 * @returns {Promise<Array|null>} An array of collections, or null in case of an error.
 */
  export async function getCollections(userid) {
    const { data, error } = await supabase
      .from('usercollections')
      .select('*')
      .eq('userid', userid);
  
    if (error) {
      console.error('Error fetching collections:', error);
      return null;
    }
    // console.log(data);
    return data;
  }