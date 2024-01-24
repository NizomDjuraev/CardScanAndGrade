import React, { useState } from "react";
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
import { createCollection } from "../backend/supabase";
import { useCollections } from "../hooks/useCollections";
import { useUser } from "@clerk/clerk-expo";

export default function HomeScreen() {
  const { user } = useUser();
  const { collections, loading, reloadCollections } = useCollections(user?.id);

  const [collectionName, setCollectionName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCollections = collections.filter((collection) => {
    return collection.collection
      .toLowerCase()
      .startsWith(searchQuery.toLowerCase());
  });

  const onCreateCollectionPress = async () => {
    if (collectionName && user) {
      await createCollection(
        user.id,
        user.firstName,
        user.lastName,
        collectionName
      );
      setCollectionName("");
      reloadCollections();
    }
  };

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
