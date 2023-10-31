import React, { useState } from "react";
import { StyleSheet, Text, TextInput, Button, TouchableOpacity, View, Modal } from "react-native";
import { SignedIn, SignedOut, useAuth, useUser } from "@clerk/clerk-expo";
import { log } from "../logger";
import { createCollection } from "../backend/supabase";
import { useCollections } from '../hooks/useCollections';


export default function SafeMyProfileScreen(props) {
  return (
    <>
      <SignedIn>
        <MyProfileScreen {...props} />
      </SignedIn>
      <SignedOut>
        <View style={styles.container}>
          <Text>Unauthorized</Text>
        </View>
      </SignedOut>
    </>
  )
}

function MyProfileScreen({ navigation }) {
  const { getToken, signOut } = useAuth();
  const { user } = useUser();
  const { collections, loading, reloadCollections } = useCollections(user?.id);


  const [sessionToken, setSessionToken] = React.useState("");

  const onSignOutPress = async () => {
    try {
      await signOut();
    } catch (err) {
      log("Error:> " + err?.status || "");
      log("Error:> " + err?.errors ? JSON.stringify(err.errors) : err);
    }
  }

  React.useEffect(() => {
    const scheduler = setInterval(async () => {
      const token = await getToken()
      setSessionToken(token)
    }, 1000)

    return () => clearInterval(scheduler)
  }, [])

  //adding a collection
  const [collectionName, setCollectionName] = useState("");
  //control the visibility of the modal
  const [modalVisible, setModalVisible] = useState(false);

  const onCreateCollectionPress = async () => {
    if (collectionName && user) {
      await createCollection(user.id, user.firstName, user.lastName, collectionName);
      // reset text input
      setCollectionName("");
      reloadCollections();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello {user?.firstName}{'\n' + '\n'}</Text>

      {loading ? (
        <Text>Loading collections...</Text>
      ) : (
        <>
        <Text style={styles.collectionsHeader}>My Collections</Text>
        {collections.map((collection, index) => (
          <View key={index} style={styles.collectionItem}>
            <Text>{collection.collection}</Text>
          </View>
        ))}
        </>
      )}
      <Text>{'\n'}</Text>

      <TouchableOpacity onPress={onSignOutPress} style={styles.link}>
        <Text style={styles.linkText}>Sign out</Text>
      </TouchableOpacity>
    
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  },
  link: {
    marginTop: 15,
    paddingVertical: 15
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7"
  },
  token: {
    marginTop: 15,
    paddingVertical: 15,
    fontSize: 15
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
    fontSize: 15,
    marginBottom: 10,
  },
})

