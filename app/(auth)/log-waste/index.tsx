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

    useSpeechRecognitionEvent("start", () => {
        setIsListening(true);
      });
      
      useSpeechRecognitionEvent("end", () => {
        setIsListening(false);
      });
      
      useSpeechRecognitionEvent("result", (event) => {
        const transcript = event.results[0]?.transcript;
        setSpokenText(transcript);
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
          continuous: false,
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