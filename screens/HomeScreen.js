import React, { useState } from "react";
import { StyleSheet, Text, TextInput, Button, TouchableOpacity, View, Modal, ScrollView, FlatList } from "react-native";
import { createCollection } from "../backend/supabase";
import { useCollections } from '../hooks/useCollections';
import { useUser } from "@clerk/clerk-expo";

export default function HomeScreen() {
    const { user } = useUser();
    const { collections, loading, reloadCollections } = useCollections(user?.id);
  
    const [collectionName, setCollectionName] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
  
    const onCreateCollectionPress = async () => {
      if (collectionName && user) {
        await createCollection(user.id, user.firstName, user.lastName, collectionName);
        setCollectionName("");
        reloadCollections();
      }
    };
  
    return (
      <View style={styles.container}>
        {loading ? (
          <Text>Loading collections...</Text>
        ) : (
          <>
            <View style={styles.collectionsContainer}>
              <FlatList
                data={collections}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <View key={index} style={styles.collectionItem}>
                    <Text style={styles.collectionText}>{item.collection}</Text>
                  </View>
                )}
                numColumns={2}
              />
            </View>
          </>
        )}
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
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
              />
              <Button title="Create Collection" onPress={onCreateCollectionPress} />
              <TouchableOpacity style={{ marginTop: 10 }} onPress={() => setModalVisible(!modalVisible)}>
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
    padding: 10
  },
  collectionCreation: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginRight: 10,
    flex: 1
  },
  addButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2e78b7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 30,
    color: '#fff',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    height: '30%',
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  collectionsHeader: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
  },
  collectionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: "center",
    width: '100%',
    paddingHorizontal: 5,
  },
  collectionItem: {
    backgroundColor: '#000',
    width: '47%',
    margin: 5,
    aspectRatio: 1,
    marginBottom: 5, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 10,
  },
  collectionText: {
    color: '#fff',
  },
})

