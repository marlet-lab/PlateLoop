import { db } from '@/config/firebase';
import { collection, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';


interface InventoryItem {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    category: string;
    swipeStatus: string; 
}

    let cardIndex = 0;

    export default function SwipeScreen() { 
        const [items, setItems] = useState<InventoryItem[]>([]); 
        const [currentItem, setCurrentItem] = useState<InventoryItem | null>(null); 
        const [selectedItems, setSelectedItems] = useState<InventoryItem[]>([]); 

        const [loading, setLoading] = useState(true);
        const [showConfirm, setShowConfirm] = useState(false);
        const [allDone, setAllDone] = useState(false);  

        const [imageUrl, setImageUrl] = useState<string>(''); // url till ingrediensbilden som hämtas från Spoonacular API 

        // animerade värden för swipe rörelsen 
        const translateX = useRef(new Animated.Value(0)).current; 
        const translateY = useRef(new Animated.Value(0)).current; 

        const getIngredientImage = async (ingredientName: string): Promise<string> => {
            try {
                const apiKey = process.env.EXPO_PUBLIC_SPOONACULAR_API_KEY;
                console.log('API key:', apiKey); 
                const response = await fetch(
                `https://api.spoonacular.com/food/ingredients/search?query=${ingredientName}&number=1&apiKey=${apiKey}`
                );
                const data = await response.json();
                console.log('Spoonacular response:', data); 
              
                if (data.results && data.results.length > 0) {
                    const imageName = data.results[0].image;
                    const url = `https://spoonacular.com/cdn/ingredients_100x100/${imageName}`;
                    console.log('Image URL:', url);
                    return url;
                }
            return '';
            } catch (error) {
                console.error('Spoonacular error:', error);
                return '';
            }
        };

        // hämta pending item från Firebase
        useEffect(() => {
            const fetchItem = async () => {  // startar en long-running funktion som hämtar data från Firebase
                try {
                    const q = query(
                        collection(db, 'inventory'),
                        orderBy('name', 'asc')
                    );
                    const snapShot = await getDocs(q);
                    const data = snapShot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    })) as InventoryItem[];

                    const pendingItems = data.filter(item => item.swipeStatus === 'pending');
                    console.log('items:', pendingItems); 
                    setItems(pendingItems);
                    setCurrentItem(pendingItems[0] || null);
                    cardIndex = 0;
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            };
            fetchItem();
        }, []);

        useEffect(() => {
            if (currentItem) {
              getIngredientImage(currentItem.name).then(url => {
                setImageUrl(url);
              });
            }
        }, [currentItem]);


        // gå till nästa kort
        const nextCard = (selected: boolean, item: InventoryItem) => {
            if(selected) {
                setSelectedItems(prev => [...prev, item]);
            }

            translateX.setValue(0);
            translateY.setValue(0);
            cardIndex++;

            if(cardIndex < items.length) {
                setCurrentItem(items[cardIndex]);
            } else {
                setCurrentItem(null);
                setShowConfirm(true);
            }
        };


        const panGesture = Gesture.Pan()
        .onUpdate((event) => { 
            // när användaren drar på kortet så uppdateras translateX och translateY med hur mycket de dragit i pixlar
            // utan animation, räknar i pixlar
            translateX.setValue(event.translationX);
            translateY.setValue(event.translationY);
        })
        .onEnd((event) => {
            if(event.translationX > 120) {
                Animated.timing(translateX, {
                    toValue: 600,  //kortet flyger till position x = 600 (utanför skärmen)
                    duration: 200, // ms
                    useNativeDriver: true,
                }).start(() => nextCard(true, currentItem!));
            } else if( event.translationX < -120) {
                Animated.spring(translateX, {
                    toValue: 0,
                    useNativeDriver: true,
                }).start(() => nextCard(false, currentItem!));
            } else {
                Animated.spring(translateX, {
                    toValue: 0,
                    useNativeDriver: true,
                }).start();
            }
        });

         // Bekräfta och uppdatera Firebase 
        const confirmSelections = async () => {
            try {
            for (const item of selectedItems) {
                await updateDoc(doc(db, 'inventory', item.id), {
                swipeStatus: 'selected',
                });
            }
            const rejected = items.filter(
                (i) => !selectedItems.find((s) => s.id === i.id)
            );
            for (const item of rejected) {
                await updateDoc(doc(db, 'inventory', item.id), {
                swipeStatus: 'rejected',
                });
            }
            setAllDone(true);
            } catch (err) {
            console.error(err);
            }
        };

        // rotation baserat på drag
        // När du drar kortet åt höger (+200px) lutar det +15 grader, åt vänster (-200px) lutar det -15 grader. Står stilla = rakt.
        const rotate = translateX.interpolate({
            inputRange: [-200, 0, 200],
            outputRange: ['-15deg', '0deg', '15deg'],
        });


        // Vid 0px är den osynlig, vid 150px är den helt synlig. 
        const likeOpacity = translateX.interpolate({
            inputRange: [0, 150],
            outputRange: [0, 1],
            extrapolate: 'clamp', //clamp betyder att den inte fortsätter ändras utanför det intervallet
        });
        const nopeOpacity = translateX.interpolate({
            inputRange: [-150, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp',
        });







        if(loading) {
            return (
                <View>
                    <Text> Laddar ingredienser</Text>
                </View>
            );
        }


        if(allDone) {
            return (
                <View>
                    <Text> Databasen uppdaterad </Text>
                    <Text> {selectedItems.length} ingredienser valda </Text>
                </View>

            );
        }


        if(showConfirm) {
            return (
                <View>
                    <Text>
                        Du valde {selectedItems.length} ingredienser
                    </Text>
                    {selectedItems.length == 0 && ( 
                        <Text> Inga ingredienser valda </Text>
                    )}

                    {selectedItems.map((item) => (
                        <View key={item.id} >
                        <Text>✓ {item.name}</Text>
                        <Text>
                          {item.quantity} {item.unit}
                        </Text>
                      </View>
                    ))}

                    <TouchableOpacity
                        style={styles.confirmBtn}
                        onPress={confirmSelections}
                    >
                        <Text style={styles.confirmBtnText}>
                            Bekräfta och uppdatera databasen
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.resetBtn}
                        onPress = {() => {
                            cardIndex = 0;
                            setSelectedItems([]);
                            setShowConfirm(false);
                            setCurrentItem(items[0]);
                            translateX.setValue(0);
                        }}
                    >
                        <Text> Börja om </Text>

                    </TouchableOpacity>
                </View>
            );
        }

        if (!currentItem) {
            return (
            <View style={styles.center}>
                <Text style={styles.doneTitle}>Inga fler ingredienser!</Text>
                <TouchableOpacity
                    style={styles.confirmBtn}
                    onPress={() => {
                        cardIndex = 0;
                        setSelectedItems([]);
                        setCurrentItem(items[0]);
                        translateX.setValue(0);
                        translateY.setValue(0);
                    }}
                >
                <Text style={styles.confirmBtnText}>Börja om</Text>
                </TouchableOpacity>
            </View>
            );
        }


        






















        // swipe vy
        return (
            <View style={styles.container}>
                <Text style={styles.header}> Vad vill du använda? </Text>
                <Text style={styles.subHeader}>
                    {cardIndex  + 1} / {items.length}
                </Text>

                <GestureDetector gesture={panGesture}>
                    <Animated.View
                    style={[
                        styles.card,
                        { transform: [{ translateX }, { translateY }, { rotate }] },
                    ]}
                    >

                    <Animated.View style={[styles.overlayRight, { opacity: likeOpacity }]}>
                        <Text style={styles.overlayRightText}>VÄLJ ✓</Text>
                    </Animated.View>

       
                    <Animated.View style={[styles.overlayLeft, { opacity: nopeOpacity }]}>
                        <Text style={styles.overlayLeftText}>SKIPPA ✗</Text>
                    </Animated.View>

      
                    {imageUrl ? (
                    <Image
                        source={{ uri: imageUrl }}
                        style={styles.cardImage}
                    />
                    ) : (
                    <View style={styles.cardImagePlaceholder}>
                        <Text style={styles.cardEmoji}>🥗</Text>
                    </View>
                    )}

    
                    <Text style={styles.cardName}>{currentItem.name}</Text>
                    <Text style={styles.cardDetail}>
                        {currentItem.quantity} {currentItem.unit}
                    </Text>
                    <Text style={styles.cardDetail}>{currentItem.category}</Text>
                    </Animated.View>
                </GestureDetector>

                

        
                <View style={styles.buttons}>
                    <TouchableOpacity
                    style={styles.skipBtn}
                    onPress={() => {
                        Animated.timing(translateX, {
                        toValue: -600,
                        duration: 200,
                        useNativeDriver: true,
                        }).start(() => nextCard(false, currentItem));
                    }}
                    >
                    <Text style={styles.skipBtnText}>✗</Text>
                    <Text style={styles.skipBtnLabel}>Skippa</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                    style={styles.selectBtn}
                    onPress={() => {
                        Animated.timing(translateX, {
                        toValue: 600,
                        duration: 200,
                        useNativeDriver: true,
                        }).start(() => nextCard(true, currentItem));
                    }}
                    >
                    <Text style={styles.selectBtnText}>✓</Text>
                    <Text style={styles.selectBtnLabel}>Välj</Text>
                    </TouchableOpacity>
                </View>


                <Text style={styles.selectedCount}>
                    Valda hittills: {selectedItems.length}
                </Text>
                </View>
            );
}


const styles = StyleSheet.create({
    container:            { flex: 1, backgroundColor: '#F3F7F5', alignItems: 'center', paddingTop: 40 },
    center:               { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F7F5' },
    header:               { fontSize: 22, fontWeight: '600', color: '#2C3328', marginBottom: 4 },
    subHeader:            { fontSize: 13, color: '#8A9E85', marginBottom: 24 },
    loadingText:          { fontSize: 16, color: '#8A9E85' },
  
    // Kort
    card:                 { width: 320, height: 420, backgroundColor: '#FFFFFF', borderRadius: 20, alignItems: 'center', justifyContent: 'center', padding: 24, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 16, elevation: 6 },
    cardImage:            { width: 140, height: 140, borderRadius: 70, marginBottom: 20 },
    cardImagePlaceholder: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#F3F7F5', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    cardEmoji:            { fontSize: 70 },
    cardName:             { fontSize: 28, fontWeight: '700', color: '#2C3328', marginBottom: 8 },
    cardDetail:           { fontSize: 15, color: '#8A9E85', marginBottom: 4 },
  
    // Overlays
    overlayRight:         { position: 'absolute', top: 30, left: 20, backgroundColor: '#005D47', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10, zIndex: 10 },
    overlayRightText:     { color: '#FEF7EA', fontSize: 18, fontWeight: '700' },
    overlayLeft:          { position: 'absolute', top: 30, right: 20, backgroundColor: '#C1440E', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 10, zIndex: 10 },
    overlayLeftText:      { color: '#FEF7EA', fontSize: 18, fontWeight: '700' },
  
    // Knappar
    buttons:              { flexDirection: 'row', gap: 40, marginTop: 32 },
    skipBtn:              { backgroundColor: '#FCEAEA', borderRadius: 50, width: 72, height: 72, justifyContent: 'center', alignItems: 'center' },
    skipBtnText:          { color: '#C1440E', fontSize: 22, fontWeight: '700' },
    skipBtnLabel:         { color: '#C1440E', fontSize: 11 },
    selectBtn:            { backgroundColor: '#EAF3DE', borderRadius: 50, width: 72, height: 72, justifyContent: 'center', alignItems: 'center' },
    selectBtnText:        { color: '#005D47', fontSize: 22, fontWeight: '700' },
    selectBtnLabel:       { color: '#005D47', fontSize: 11 },
    selectedCount:        { marginTop: 16, fontSize: 13, color: '#8A9E85' },
  
    // Bekräftelsesida
    confirmTitle:         { fontSize: 22, fontWeight: '600', color: '#2C3328', marginBottom: 20, paddingHorizontal: 20, textAlign: 'center' },
    confirmItem:          { flexDirection: 'row', justifyContent: 'space-between', width: '90%', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, marginBottom: 8 },
    confirmItemName:      { fontSize: 15, fontWeight: '500', color: '#2C3328' },
    confirmItemDetail:    { fontSize: 13, color: '#8A9E85' },
    confirmBtn:           { marginTop: 20, backgroundColor: '#005D47', borderRadius: 12, padding: 16, width: '90%', alignItems: 'center' },
    confirmBtnText:       { color: '#FEF7EA', fontSize: 15, fontWeight: '600' },
    resetBtn:             { marginTop: 10, padding: 14, width: '90%', alignItems: 'center' },
    resetBtnText:         { color: '#8A9E85', fontSize: 14 },
    emptyText:            { fontSize: 14, color: '#8A9E85', marginBottom: 16 },
  
    // Klart-sida
    doneEmoji:            { fontSize: 60, marginBottom: 16 },
    doneTitle:            { fontSize: 22, fontWeight: '600', color: '#2C3328', marginBottom: 8 },
    doneSubtitle:         { fontSize: 15, color: '#8A9E85' },
  });