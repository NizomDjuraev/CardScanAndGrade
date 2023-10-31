import "react-native-url-polyfill/auto"
import { createClient } from "@supabase/supabase-js"


const supabaseUrl = 'https://zrjswhazqjmxcwqlxsnj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpyanN3aGF6cWpteGN3cWx4c25qIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg3Njc2MzUsImV4cCI6MjAxNDM0MzYzNX0.8L-faWju0jWXWMD3VXKpOMqHmWet2mU59AeLwCXqfVg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

  export async function getCollections(userid) {
    const { data, error } = await supabase
      .from('usercollections')
      .select('*')
      .eq('userid', userid);
  
    if (error) {
      console.error('Error fetching collections:', error);
      return null;
    }
    console.log(data);
    return data;
  }