import React, { useEffect,useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  View,
  Modal,
  FlatList,
} from "react-native";
import { createCollection } from "../backend/server";
import { useCollections } from "../hooks/useCollections";
// import { useUser } from "@clerk/clerk-expo";
import { auth } from "../firebaseConfig";

/**
* HomeScreen component displays a user's collections and allows for searching and creating new collections. 
* It utilizes user authentication and collection management hooks.
* @function HomeScreen
* @returns {Object} The Home screen component.
*/
export default function HomeScreen() {
  const [user, setUser ] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);
  const { collections, loading, reloadCollections } = useCollections(user?.email);

  const [collectionName, setCollectionName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  /**
  * Filters collections based on the search query. 
  * @function filteredCollections
  * @returns {Array} Filtered list of collections.
  */
  const filteredCollections = collections.filter((collection) => {
    return collection.collection
      .toLowerCase()
      .startsWith(searchQuery.toLowerCase());
  });

  /**
  * Creates a new collection for the user and reloads the collection list.
  * Requires the user to be defined and collectionName to be not empty.
  * @async
  * @function onCreateCollectionPress
  * @returns {Promise<void>} A promise that resolves once the collection has been created and the list reloaded.
  */
  const onCreateCollectionPress = async () => {
    if (collectionName && user) {
      await createCollection(
        user.email,
        user.displayName.split(" ")[0],
        user.displayName.split(" ")[1] || "",
        collectionName
      );
      setCollectionName("");
      reloadCollections();
    }
  };

  /**
  * Updates the search query state.
  * @function updateSearchQuery
  * @param {string} query - The current text in the search input.
  */
  const updateSearchQuery = (query) => {
    setSearchQuery(query);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBarInput}
          placeholder="Search for a collection"
          placeholderTextColor="#000"
          value={searchQuery}
          onChangeText={updateSearchQuery}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <Text>Loading collections...</Text>
      ) : (
        <>
          <View style={styles.collectionsContainer}>
            <FlatList
              data={filteredCollections}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <View key={index} style={styles.collectionItem}>
                  <Text style={styles.collectionText}>{item.collection}</Text>
                </View>
              )}
              numColumns={2}
              style={{ height: 612 }}
            />
          </View>
        </>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              value={collectionName}
              onChangeText={setCollectionName}
              placeholder="Enter collection name"
              placeholderTextColor="#a7a7a7"
            />
            <Button
              title="Create Collection"
              onPress={onCreateCollectionPress}
            />
            <TouchableOpacity
              style={{ marginTop: 10 }}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    backgroundColor: "#959595",
  },
  collectionCreation: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginRight: 10,
    flex: 1,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#2e78b7",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 15,
    marginRight: 15,
    marginTop: 40,
  },
  addButtonText: {
    fontSize: 30,
    color: "#fff",
    textAlignVertical: "center",
    textAlign: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    height: "30%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  collectionsHeader: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10,
  },
  collectionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
    paddingHorizontal: 5,
    marginTop: "39%",
  },
  collectionItem: {
    width: "48%",
    aspectRatio: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    margin: "1%",
    borderRadius: 10,
  },
  collectionText: {
    color: "#fff",
  },
  searchBarContainer: {
    backgroundColor: "#272727",
    height: "20%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    top: 0,
  },
  searchBarInput: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 15,
    flex: 1,
    marginLeft: 15,
    marginTop: 40,
  },
});
