import * as Speech from "expo-speech";
import { ExpoSpeechRecognitionModule, useSpeechRecognitionEvent } from "expo-speech-recognition";
import React, { useState } from 'react';
import { Button, Modal, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LogWaste() {
    const [modalVisible, setModalVisible] = useState(false);
    const [product, setProduct] = useState ("");
    const [weight, setWeight] = useState ("");
    const [menuItem, setMenuItem] = useState ("");
    const [isListening, setIsListening] = useState(false);
    const [spokenText, setSpokenText] = useState("");
    
    const wordsToNumbers = (text: string) => {
        return text
        .replace(/\bto\b/g, "2")
        .replace(/\btwo\b/g, "2")
        .replace(/\bfor\b/g, "4")
        .replace(/\bfour\b/g, "4")
    };

    const parseSpeech = (text: string) => {
        const lowerText = wordsToNumbers(
            text.toLowerCase()
        );
        
        if (lowerText.includes("stop")) {
            ExpoSpeechRecognitionModule.stop();
           
            const summary = `You logged ${weight} kilo of ${product} when prepping ${menuItem}`;
            Speech.speak(summary, {
            language: "en-US",
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
        parseSpeech(transcript);
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
        <View style={{flex: 1}}>
           <Text> Log new waste</Text>
            <Button title='Start' onPress={() => setModalVisible(true)} />
            
            <Modal 
            visible = {modalVisible}
            transparent ={true}>
                <View style={styles.centeredView}>
                <View style={styles.modalView}>
                <Text>Logging waste, you can use speech</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Product"
                    value = {product}
                    onChangeText={setProduct}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Weight"
                    value = {weight}
                    onChangeText={setWeight}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Menu Item"
                    value = {menuItem}
                    onChangeText={setMenuItem}
                />
            <Button 
                title='Save' onPress={() => setModalVisible(false)} 
            />
            <Button
                title={isListening ? "Listening..." : "Use speech"}
                onPress={handleStart}
              
            />
            <Button //för att testa mic
             title="Stop speech"
            onPress={() => ExpoSpeechRecognitionModule.stop()}
            />

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
          padding: 20,
        },
        input: {
          height: 40,
          margin: 12,
          borderWidth: 1,
          padding: 10,
        },
        
        centeredView: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
        },
        modalView: {
            margin: 20,
            backgroundColor: 'white',
            alignItems: 'center',
            padding: 25,
        },

}); 