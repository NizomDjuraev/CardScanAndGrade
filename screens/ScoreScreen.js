import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { getAuth, getIdToken } from "firebase/auth";

export default function ScoreScreen({ navigation }) {
  const route = useRoute();
  const [imageUri, setImageUri] = useState("");
  const [presignedFrontUrl, setPresignedFrontUrl] = useState(""); // State to store presigned upload URL
  const [objectFrontUrl, setObjectFrontUrl] = useState(""); // State to store the object URL
  const [cardId, setCardId] = useState(null); // State to store the generated cardID
  const [loading, setLoading] = useState(false); // State to track loading state
  const [cardInfo, setCardInfo] = useState(null); // State to store card info

  useEffect(() => {
    if (route.params && route.params.imageData.uri) {
      setImageUri(route.params.imageData.uri);
    }
  }, [route.params]);

  // UseEffect for uploading
  useEffect(() => {
    // Function to fetch presigned upload URL
    async function fetchPresignedUrl() {
      try {
        setLoading(true); // Set loading state to true while fetching
        const auth = getAuth(); // Get the auth instance
        if (auth.currentUser) {
          const idToken = await getIdToken(auth.currentUser); // Get ID token from current user
          const response = await fetch(
            "https://dauj6fcsil.execute-api.us-east-1.amazonaws.com/v1/uploadUrl",
            {
              headers: {
                Authorization: `Bearer ${idToken}`, // Use ID token in Authorization header
              },
            }
          );
          const data = await response.json();
          setPresignedFrontUrl(data.frontUrl);

          // Upload front image
          await fetch(data.frontUrl, {
            method: "PUT",
            body: imageUri,
            headers: {
              "Content-Type": "image/jpeg",
            },
          });
          setObjectFrontUrl(data.frontUrl.split("?")[0]); // Extract object URL
        } else {
          console.error("User not authenticated");
          // Handle case where user is not authenticated
        }
        setLoading(false); // Reset loading state after fetching and uploading
      } catch (error) {
        console.error(
          "Error fetching/presigned URL or uploading image:",
          error
        );
        setLoading(false); // Reset loading state after error
      }
    }

    fetchPresignedUrl(); // Call the function to fetch presigned upload URL
  }, []);

  // UseEffect for submitting for grading
  useEffect(() => {
    async function submitCardForGrading() {
      try {
        setLoading(true);

        const auth = getAuth();
        if (auth.currentUser) {
          const idToken = await getIdToken(auth.currentUser);

          // Prepare the request body with the object URL(s)
          const requestBody = {
            frontUrl: objectFrontUrl,
            // When we have a back image, include its URL in the request body as well
            // backImageUrl: objectBackUrl,
          };

          // Make the POST request to submit the card for grading
          const response = await fetch(
            "https://dauj6fcsil.execute-api.us-east-1.amazonaws.com/v1/cards",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${idToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(requestBody),
            }
          );

          if (response.ok) {
            const responseData = await response.json();
            // Upon successful grading initiation, you'll receive the card ID
            setCardId(responseData.cardId);
            console.log(
              "Card submitted for grading. Card ID:",
              responseData.cardId
            );
          } else {
            console.error(
              "Failed to submit card for grading:",
              response.status
            );
          }
        } else {
          console.error("User not authenticated");
          // Handle case where user is not authenticated
        }

        setLoading(false); // Reset loading state after submitting
      } catch (error) {
        console.error("Error submitting card for grading:", error);
        setLoading(false); // Reset loading state after error
      }
    }

    if (objectFrontUrl) {
      submitCardForGrading(); // Call the function to submit the card for grading once the object URL is available
    }
  }, [objectFrontUrl]); // Run this effect when objectFrontUrl changes

  // UseEffect for information of a single card
  useEffect(() => {
    // Function to fetch card information
    async function fetchCardInfo() {
      try {
        const auth = getAuth();
        if (auth.currentUser) {
          const idToken = await getIdToken(auth.currentUser);
          const response = await fetch(
            `https://dauj6fcsil.execute-api.us-east-1.amazonaws.com/v1/cards/${cardId}`,
            {
              headers: {
                Authorization: `Bearer ${idToken}`,
              },
            }
          );
          const data = await response.json();
          setCardInfo(data);
          console.log("Card information:", data);
          // Handle the received card information as needed
        } else {
          console.error("User not authenticated");
          // Handle case where user is not authenticated
        }
      } catch (error) {
        console.error("Error fetching card information:", error);
      }
    }

    if (cardId) {
      fetchCardInfo();
    }
  }, [cardId]);

  const handleExitButtonClick = () => {
    navigation.navigate("Annotate");
  };
  const handleFrontButtonClick = () => {
    // add front button logic here
  };
  const handleToggleButtonClick = () => {
    // add toggle button logic here
  };
  const handleShareButtonClick = () => {
    // Navigate to Export screen and pass the image URI as a parameter
    navigation.navigate("Export", { imageData: { uri: imageUri } });
  };
  const handleAddToCollectionButtonClick = () => {
    // add add to collection button logic here
    navigation.navigate("Home");
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBackground}></View>
      <View style={styles.middleBackground}></View>
      <View style={styles.bottomBackground}></View>

      <View style={styles.overlayBox}>
        {/* exit button */}
        <TouchableOpacity
          onPress={handleExitButtonClick}
          style={styles.exitButtonContainer}
        >
          <Ionicons name="close-circle-outline" size={35} color="#1D9DB9" />
        </TouchableOpacity>

        {/* Text above image container */}
        <View style={styles.textContainer}>
          <Text style={styles.text}>Bryce Harper</Text>
        </View>

        {/* container for image */}
        <View style={styles.cardImageContainer}>
          <Image style={styles.cardImage} source={{ uri: imageUri }} />
        </View>

        {/* container for front and toggle buttons */}
        <View style={styles.frontToggleContainer}>
          <TouchableOpacity
            onPress={handleFrontButtonClick}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleToggleButtonClick}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Toggle</Text>
          </TouchableOpacity>
        </View>

        {/* Scrollble dark grey box of card information */}
        <ScrollView style={styles.scrollableInformation}>
          <Text style={styles.informationText}>Information</Text>

          <View style={styles.informationBox}>
            <Text style={styles.informationText}>
              Year:{" "}
              {cardInfo && cardInfo.card && cardInfo.card.year !== null
                ? cardInfo.card.year
                : "null"}
            </Text>
          </View>
          <View style={styles.informationBox}>
            <Text style={styles.informationText}>
              Brand:{" "}
              {cardInfo && cardInfo.card && cardInfo.card.brand !== null
                ? cardInfo.card.brand
                : "null"}
            </Text>
          </View>
          <View style={styles.informationBox}>
            <Text style={styles.informationText}>
              Set:{" "}
              {cardInfo && cardInfo.card && cardInfo.card.set !== null
                ? cardInfo.card.set
                : "null"}
            </Text>
          </View>
          <View style={styles.informationBox}>
            <Text style={styles.informationText}>
              Number:{" "}
              {cardInfo && cardInfo.card && cardInfo.card.cardNumber !== null
                ? cardInfo.card.cardNumber
                : "null"}
            </Text>
          </View>
          <View style={styles.informationBox}>
            <Text style={styles.informationText}>
              Variation:{" "}
              {cardInfo && cardInfo.card && cardInfo.card.variation !== null
                ? cardInfo.card.variation
                : "null"}
            </Text>
          </View>
          <View style={styles.sideBySideBoxesContainer}>
            <View style={[styles.sideBySideBox, { flex: 0.7 }]}>
              <Text style={styles.sideBySideBoxText}>Edge</Text>
            </View>
            <View style={[styles.sideBySideBox, { flex: 0.3, marginLeft: 5 }]}>
              <Text style={styles.sideBySideBoxText}>
                {cardInfo && cardInfo.card && cardInfo.card.edgeScore !== null
                  ? cardInfo.card.edgeScore
                  : "null"}
              </Text>
            </View>
          </View>
          <View style={styles.sideBySideBoxesContainer}>
            <View style={[styles.sideBySideBox, { flex: 0.7 }]}>
              <Text style={styles.sideBySideBoxText}>Border</Text>
            </View>
            <View style={[styles.sideBySideBox, { flex: 0.3, marginLeft: 5 }]}>
              <Text style={styles.sideBySideBoxText}>
                {cardInfo && cardInfo.card && cardInfo.card.borderScore !== null
                  ? cardInfo.card.borderScore
                  : "null"}
              </Text>
            </View>
          </View>
          <View style={styles.sideBySideBoxesContainer}>
            <View style={[styles.sideBySideBox, { flex: 0.7 }]}>
              <Text style={styles.sideBySideBoxText}>Surface</Text>
            </View>
            <View style={[styles.sideBySideBox, { flex: 0.3, marginLeft: 5 }]}>
              <Text style={styles.sideBySideBoxText}>
                {cardInfo &&
                cardInfo.card &&
                cardInfo.card.surfaceScore !== null
                  ? cardInfo.card.surfaceScore
                  : "null"}
              </Text>
            </View>
          </View>
          <View style={styles.sideBySideBoxesContainer}>
            <View style={[styles.sideBySideBox, { flex: 0.7 }]}>
              <Text style={styles.sideBySideBoxText}>Overall</Text>
            </View>
            <View style={[styles.sideBySideBox, { flex: 0.3, marginLeft: 5 }]}>
              <Text style={styles.sideBySideBoxText}>
                {cardInfo &&
                cardInfo.card &&
                cardInfo.card.overallScore !== null
                  ? cardInfo.card.overallScore
                  : "null"}
              </Text>
            </View>
          </View>

          {/* More Details */}
          <Text style={styles.moreDetailsText}>More Details</Text>
          <View style={styles.moreDetailsBox}>
            <Text style={styles.informationText}>
              {cardInfo && cardInfo.card && cardInfo.card.details !== null
                ? cardInfo.card.details
                : "null"}
            </Text>
          </View>
        </ScrollView>

        {/* Share and Add to Collection Buttons */}
        <View style={styles.shareCollectionButtonsContainer}>
          <TouchableOpacity
            onPress={handleShareButtonClick}
            style={styles.shareCollectionButtons}
          >
            <Text style={styles.shareCollectionButtonsText}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleAddToCollectionButtonClick}
            style={styles.shareCollectionButtons}
          >
            <Text style={styles.shareCollectionButtonsText}>
              Add to Collection
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#959595",
    position: "relative",
  },
  topBackground: {
    flex: 1,
    backgroundColor: "#272727",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  middleBackground: {
    flex: 6,
    backgroundColor: "#959595",
  },
  bottomBackground: {
    flex: 1,
    backgroundColor: "#272727",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  overlayBox: {
    position: "absolute",
    top: "6%",
    bottom: "5%",
    left: "5%",
    right: "5%",
    backgroundColor: "#D9D9D9",
    borderRadius: 20,
    padding: 20,
    elevation: 5,
  },
  cardImageContainer: {
    backgroundColor: "#1D9DB9",
    width: "100%",
    height: "60%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "5%",
  },
  cardImage: {
    width: "95%",
    height: "95%",
    resizeMode: "cover",
  },
  exitButtonContainer: {
    position: "absolute",
    top: 5,
    left: 6,
    zIndex: 1,
  },
  textContainer: {
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    color: "black",
  },
  frontToggleContainer: {
    backgroundColor: "#272727",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    height: 40,
    marginTop: 10,
    marginBottom: 10,
    width: "100%",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1D9DB9",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "black",
    height: "70%",
    width: "30%",
  },
  buttonText: {
    color: "black",
    fontSize: 16,
  },
  scrollableInformation: {
    backgroundColor: "#C6C6C6",
  },
  informationBox: {
    backgroundColor: "white",
    padding: 3,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    borderColor: "black",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  informationText: {
    color: "black",
    fontSize: 18,
    textAlign: "center",
  },
  sideBySideBoxesContainer: {
    flexDirection: "row",
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
  },
  sideBySideBox: {
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 30,
  },
  sideBySideBoxText: {
    color: "black",
    fontSize: 18,
    textAlign: "center",
  },
  moreDetailsText: {
    color: "black",
    fontSize: 18,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  moreDetailsBox: {
    backgroundColor: "white",
    padding: 3,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    borderColor: "black",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    height: 150,
  },
  shareCollectionButtonsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  shareCollectionButtons: {
    flex: 0.5,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "black",
    height: 40,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  shareCollectionButtonsText: {
    color: "black",
    fontSize: 16,
  },
});
