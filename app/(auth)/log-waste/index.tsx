import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from 'expo-router';
import * as Speech from "expo-speech";
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from "expo-speech-recognition";
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LogWaste() {
    const [modalVisible, setModalVisible] = useState(false);
    const [product, setProduct] = useState ("");
    const [weight, setWeight] = useState ("");
    const [menuItem, setMenuItem] = useState ("");
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [spokenText, setSpokenText] = useState("");
    const [confirmationMode, setConfirmationMode] = useState(false);
    const navigation = useNavigation();
    navigation.setOptions({ title: 'Dashboard' });

    const saveWaste = () => {
        ExpoSpeechRecognitionModule.stop();

        console.log({
            product,
            weight,
            menuItem,
        });

        setModalVisible(false);
        setProduct("");
        setWeight("");
        setMenuItem("");
        setSpokenText("");
        setConfirmationMode(false);
    }
    
    const wordsToNumbers = (text: string) => {
        return text
        .replace(/\bto\b/g, "2")
        .replace(/\btwo\b/g, "2")
        .replace(/\bfor\b/g, "4")
        .replace(/\bfour\b/g, "4")
    };

    const handleConfirmation = (text: string) => {
        const lowerText = text.toLowerCase();
      
        if (lowerText.includes("repeat")) {
            if (isSpeaking) return;

            setIsSpeaking(true);
            ExpoSpeechRecognitionModule.stop();
          Speech.speak(getSummary(), {
            language: "en-US",
            onDone: () => {
                ExpoSpeechRecognitionModule.start({
                    lang: "en-Us",
                    interimResults: false,
                    continuous: true,
                })
            }
          });
          return;
        }
      
        if (lowerText.includes("no")) {
          setConfirmationMode(false);
          setSpokenText("");
      
          Speech.speak("Okay, please log the waste again.", {
            language: "en-US",
          });
      
          ExpoSpeechRecognitionModule.start({
            lang: "en-US",
            interimResults: true,
            continuous: true,
          });
      
          return;
        }
      
        if (lowerText.includes("yes")) {
          Speech.speak("Waste successfully logged.", {
            language: "en-US",
          });
      
          saveWaste();
        }
      };

    const getSummary = () => {
        return `You logged ${weight} kilo of ${product} for ${menuItem}. Is that correct?`;
      };


    

    const parseSpeech = (text: string) => {
        const lowerText = wordsToNumbers(
            text.toLowerCase()
        );
        
        if (lowerText.includes("stop")) {
            ExpoSpeechRecognitionModule.stop();
            setConfirmationMode(true);
           
            Speech.speak(getSummary(), {
            language: "en-US",
            onDone: () => {
                ExpoSpeechRecognitionModule.start({
                lang: "en-Us",
                interimResults: true,
                continuous: true,
            });
            },
          }); 
          return;
        }


        const productMatch = lowerText.match(/product (.*?)(?= weight| wait| menu item|$)/);
        const weightMatch = lowerText.match(/(?:weight|wait) (.*?)(?= product| menu item|$)/);
        const menuItemMatch = lowerText.match(/menu item (.*?)(?= product| weight| wait|$)/);
      
        if (productMatch && productMatch[1]) {
            setProduct(productMatch[1].trim());
          }
        
          if (weightMatch && weightMatch[1]) {
            setWeight(weightMatch[1].trim());
          }
        
          if (menuItemMatch && menuItemMatch[1]) {
            setMenuItem(menuItemMatch[1].trim());
          }
        };

    useSpeechRecognitionEvent("start", () => {
        setIsListening(true);
      });
      
      useSpeechRecognitionEvent("end", () => {
        setIsListening(false);
      });
      
      useSpeechRecognitionEvent("result", (event) => {
        const transcript = event.results[0]?.transcript || "";
        setSpokenText(transcript);

        if (confirmationMode) {
            handleConfirmation(transcript);
        } else {
        parseSpeech(transcript);
        }
      });

      useSpeechRecognitionEvent("error", (event) => {
        console.log("Speech recognition error:", event);
      });
    
      const handleStart = async () => {
        const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
        if (!result.granted) {
          console.warn("Permissions not granted", result);
          return;
        }
        // Start speech recognition
        ExpoSpeechRecognitionModule.start({
          lang: "en-US",
          interimResults: true,
          continuous: true,
        });
    };

    return (        
        <View style={styles.container}>
           <Text style={styles.title}>
                Log food waste
            </Text>
            <Pressable
            style ={styles.startButton}
            onPress={() => setModalVisible(true)} 
            >
                <Text style = {styles.startButtonText}>Start</Text>
            </Pressable>
            
            <Modal 
            visible = {modalVisible}
            transparent ={true}>
                <View style={styles.centeredView}>
                <View style={styles.modalView}>

                <Text style={styles.modalTitle}>Log food waste</Text>
                <Text style={styles.modalSubtitle}>
                     Use voice commands or fill in the fields manually
                </Text>

                <View style={styles.formCard}>
                <Text style={styles.label}>Product</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g Apple"
                    value = {product}
                    onChangeText={setProduct}
                />
                 </View>  

                <View style={styles.formCard}>
                <Text style={styles.label}>Weight</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g 2.5"
                    value = {weight}
                    onChangeText={setWeight}
                />
                </View> 
                
                <View style={styles.formCard}>
                <Text style={styles.label}>Menu item</Text>
                <TextInput
                    style={styles.input}
                    placeholder="e.g Apple pie"
                    value = {menuItem}
                    onChangeText={setMenuItem}
                />
                </View>
                

                <Pressable style={styles.saveButton} onPress={saveWaste}>
                <Text style={styles.saveButtonText}>Save waste</Text>
                </Pressable>

            <Pressable
                style = {[
                    styles.micButton,
                    isListening && styles.micButtonActive,
                ]}
                onPress={handleStart}
              >
                <Ionicons
                name = {isListening ? "mic" : "mic-outline"}
                size = {30}
                
                />
                </Pressable>
                <Text style={styles.listeningText}>
                 {isListening ? "Listening..." : "Tap the mic and speak"}
                </Text>
        
             <Text>{spokenText}</Text>
             </View>
           
            </View>
            
            </Modal>

         </View>

        
      );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: 20
    },

        input: {
          height: 48,
          margin: 12,
          borderWidth: 1,
          borderColor: "#D1D1D1",
          padding: 10,
          borderRadius: 12,
          backgroundColor: "#F5FAF9"
        },
        
        centeredView: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
        },
        modalView: {
            width: "82%",
            backgroundColor: "white",
            borderRadius: 20,
            alignItems: "center",
            padding: 25,
        },

        modalTitle: {
            fontSize: 26,
            fontWeight: "700",
            color: "#91B8AD",
            marginBottom: 6,
        },

        modalSubtitle: {
            fontSize: 14,
            color: "#8B6F6F",
            textAlign: "center",
            marginBottom: 20,
          },

          saveButton: {
            backgroundColor: "#006046",
            paddingVertical: 14,
            paddingHorizontal: 36,
            borderRadius: 16,
            minWidth: 180,
            alignItems: "center",
          },
          
          saveButtonText: {
            color: "white",
            fontSize: 16,
            fontWeight: "700",
          },

        micButton: {
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: "#C1A0F2",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 15,
            marginBottom: 8,
          },

          micButtonActive: {
            backgroundColor: "#C62828",
          },
          listeningText: {
            fontSize: 16,
            color: "#555",
            marginBottom: 10,
          },

          title: {
            fontSize: 28,
            fontWeight: "bold",
            color: "#93BBB2",
            marginBottom: 15,
            alignItems: "center",
            justifyContent: "center",
          },

          startButton: {
            backgroundColor: "#006046",
            borderRadius: 24,
            paddingVertical: 20,
            paddingHorizontal: 60,
            alignItems: "center",
          },

          startButtonText: {
            color: "white",
            fontSize: 24,
          },
          label: {

          },

          formCard: {
            width: "100%",
            backgroundColor: "#FFFFFF",
            borderRadius: 18,
            padding: 10,
            marginBottom: 22,
            borderColor: "#D7E2DF",
            borderWidth: 1,
          }
}); 