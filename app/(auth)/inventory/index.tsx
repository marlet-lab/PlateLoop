import { db } from '@/config/firebase';
import { router } from 'expo-router';
import { collection, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  expiryDate: string;
  swipeStatus: string;
  image_url?: string;
}

const getFoodEmoji = (name: string): string => {
  const emojiMap: { [key: string]: string } = {
    cucumber: '🥒', apple: '🍎', chicken: '🍗',
    salmon: '🐟', zucchini: '🥬', tomato: '🍅',
    carrot: '🥕', broccoli: '🥦', beef: '🥩',
  };
  return emojiMap[name.toLowerCase()] || '🥗';
};

const getDaysLeft = (expiryDate: string): number => {
  return Math.ceil(
    (new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
};

const ExpiryBadge = ({ expiryDate }: { expiryDate: string }) => {
  const days = getDaysLeft(expiryDate);
  const label =
    days < 0 ? `Expired ${Math.abs(days)}d ago`
    : days === 0 ? 'Expires today'
    : `${days} days left`;
  const style =
    days < 0 ? { bg: '#FCEBEB', text: '#A32D2D' }
    : days === 0 ? { bg: '#FFF3DC', text: '#854F0B' }
    : { bg: '#EAF3DE', text: '#3B6D11' };
  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      <Text style={[styles.badgeText, { color: style.text }]}>{label}</Text>
    </View>
  );
};


const StatCard = ({ label, value, valueColor }: { label: string; value: number; valueColor?: string }) => (
  <View style={styles.statCard}>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={[styles.statValue, valueColor ? { color: valueColor } : {}]}>{value}</Text>
  </View>
);


const ExpiringItemCard = ({ item }: { item: InventoryItem }) => {
  const days = getDaysLeft(item.expiryDate);
  const borderColor = days < 0 ? '#E24B4A' : days === 0 ? '#EF9F27' : '#639922';
  const isExpired = days < 0;

  return (
    <View style={[styles.expiringCard, { borderLeftColor: borderColor }]}>
      <View style={styles.expiringCardTop}>
        <View style={styles.expiringCardInfo}>
          <Text style={styles.expiringCardName}>{item.name}</Text>
          <Text style={styles.expiringCardMeta}>
            {item.quantity} {item.unit} · {item.category} · {item.expiryDate}
          </Text>
        </View>
        <ExpiryBadge expiryDate={item.expiryDate} />
      </View>
      <View style={styles.expiringActions}>
        {!isExpired && (
          <>
            <TouchableOpacity
              style={[styles.actionChip, styles.recipeChip]}
              onPress={() => Alert.alert('Use in recipe', item.name)}
            >
              <Text style={[styles.actionChipText, { color: '#0F6E56' }]}> Use in recipe</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionChip, styles.freezeChip]}
              onPress={() => Alert.alert('Freeze', item.name)}
            >
              <Text style={[styles.actionChipText, { color: '#185FA5' }]}> Freeze</Text>
            </TouchableOpacity>
          </>
        )}
        <TouchableOpacity
          style={[styles.actionChip, styles.staffChip]}
          onPress={() => Alert.alert('Staff food', item.name)}
        >
          <Text style={[styles.actionChipText, { color: '#3B6D11' }]}> Staff food</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionChip, styles.wasteChip]}
          onPress={() => Alert.alert('Log waste', item.name)}
        >
          <Text style={[styles.actionChipText, { color: '#A32D2D' }]}> Log waste</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


export default function InventoryScreen() {
  const [items, setItems]           = useState<InventoryItem[]>([]);
  const [loading, setLoading]       = useState(true);
  const [activeTab, setActiveTab]   = useState<'lowStock' | 'inventory' | 'expiring'>('inventory');

  
  const [editItem, setEditItem]         = useState<InventoryItem | null>(null);
  const [editName, setEditName]         = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [editUnit, setEditUnit]         = useState('');
  const [editExpiry, setEditExpiry]     = useState('');

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const q = query(collection(db, 'inventory'), orderBy('name', 'asc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as InventoryItem[];
        setItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

 
  const openEdit = (item: InventoryItem) => {
    setEditItem(item);
    setEditName(item.name);
    setEditCategory(item.category);
    setEditQuantity(String(item.quantity));
    setEditUnit(item.unit);
    setEditExpiry(item.expiryDate);
  };

  const closeEdit = () => setEditItem(null);

  const saveEdit = async () => {
    if (!editItem) return;
    try {
      await updateDoc(doc(db, 'inventory', editItem.id), {
        name:       editName,
        category:   editCategory,
        quantity:   Number(editQuantity),
        unit:       editUnit,
        expiryDate: editExpiry,
      });
      // Uppdatera lokalt
      setItems(prev => prev.map(i =>
        i.id === editItem.id
          ? { ...i, name: editName, category: editCategory, quantity: Number(editQuantity), unit: editUnit, expiryDate: editExpiry }
          : i
      ));
      closeEdit();
    } catch (err) {
      console.error(err);
      Alert.alert('Fel', 'Kunde inte spara ändringarna');
    }
  };

  // Filtrering
  const filteredItems = items.filter(item => {
    if (activeTab === 'lowStock')  return item.quantity < 2;
    if (activeTab === 'expiring')  return getDaysLeft(item.expiryDate) <= 3;
    return true;
  });

  // Expiring-sektioner
  const expired = filteredItems.filter(i => getDaysLeft(i.expiryDate) < 0);
  const today   = filteredItems.filter(i => getDaysLeft(i.expiryDate) === 0);
  const soon    = filteredItems.filter(i => getDaysLeft(i.expiryDate) > 0 && getDaysLeft(i.expiryDate) <= 3);

  const tabs = [
    { key: 'lowStock',  label: 'Low In Stock' },
    { key: 'inventory', label: 'Inventory' },
    { key: 'expiring',  label: 'Expiring Soon' },
  ] as const;

  
  const renderItem = ({ item, index }: { item: InventoryItem; index: number }) => (
    <View style={styles.row}>
      <View style={styles.checkboxCol}>
        <View style={styles.checkbox} />
      </View>
      <Text style={[styles.cell, styles.codeCol]}>V0{index + 1}234</Text>
      <View style={[styles.photoCol]}>
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.itemImage} />
        ) : (
          <Text style={styles.emoji}>{getFoodEmoji(item.name)}</Text>
        )}
      </View>
      <Text style={[styles.cell, styles.nameCol]}>{item.name}</Text>
      <Text style={[styles.cell, styles.groupCol]}>{item.category}</Text>
      <Text style={[styles.cell, styles.dateCol]}>{item.expiryDate}</Text>
      <Text style={[styles.cell, styles.quantityCol]}>{item.quantity} {item.unit}</Text>
      <View style={styles.actionCol}>
        <TouchableOpacity
          style={styles.editChipBtn}
          onPress={() => openEdit(item)}
        >
          <Text style={styles.editChipText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreBtn}>
          <Text style={styles.moreIcon}>•••</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>

        {/* Tab bar */}
        <View style={styles.tabBar}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'expiring' ? (
        <ScrollView showsVerticalScrollIndicator={false}>

             {/* Stats */}
            <View style={styles.statsRow}>
                <StatCard label="Expired food"      value={expired.length} valueColor="#A32D2D" />
                <StatCard label="Expires today"     value={today.length}   valueColor="#854F0B" />
                <StatCard label="Expires in 3 days" value={soon.length} />
                <StatCard label="Total"             value={filteredItems.length} />
            </View>


            {filteredItems.length === 0 && (
            <View style={styles.allGoodBox}>
                <View style={styles.allGoodIcon}>
                <Text style={{ fontSize: 40 }}> </Text>
                </View>
                <Text style={styles.allGoodTitle}>All good!</Text>
                <Text style={styles.allGoodSubtitle}>
                No ingredients expiring soon.{'\n'}Your inventory is well managed!
                </Text>
            </View>
            )}

            {/* Sektioner */}
            {expired.length > 0 && (
            <>
                <Text style={[styles.sectionTitle, { color: '#A32D2D' }]}>
                EXPIRED — ACT IMMEDIATELY
                </Text>
                {expired.map(item => <ExpiringItemCard key={item.id} item={item} />)}
            </>
            )}
            {today.length > 0 && (
            <>
                <Text style={[styles.sectionTitle, { color: '#854F0B' }]}>
                EXPIRES TODAY
                </Text>
                {today.map(item => <ExpiringItemCard key={item.id} item={item} />)}
            </>
            )}
            {soon.length > 0 && (
            <>
                <Text style={styles.sectionTitle}>EXPIRES IN 1–3 DAYS</Text>
                {soon.map(item => <ExpiringItemCard key={item.id} item={item} />)}
            </>
            )}

            <View style={styles.legend}>
                <Text style={styles.legendTitle}>What do the actions mean?</Text>
                {[
                    { icon: '', label: 'Use in recipe', desc: 'Generates a recipe suggestion using this ingredient' },
                    { icon: '', label: 'Freeze',        desc: 'Moves item to frozen storage and extends expiry date' },
                    { icon: '', label: 'Staff food',    desc: 'Marks item as used for staff meals, logged in insights' },
                    { icon: '',  label: 'Log waste',    desc: 'Removes item and logs it as food waste in insights' },
                ].map(row => (
                    <View key={row.label} style={styles.legendRow}>
                    <Text style={styles.legendIcon}>{row.icon}</Text>
                    <View>
                        <Text style={styles.legendLabel}>{row.label}</Text>
                        <Text style={styles.legendDesc}>{row.desc}</Text>
                    </View>
                    </View>
                ))}
                </View>
            <View style={{ height: 24 }} />


        </ScrollView>

        ) : (
        <>
            <View style={styles.toolbar}>
                <View style={styles.spacer} />
                <View style={styles.searchBox}>
                    <Text style={styles.searchIcon}> </Text>
                    <Text style={styles.searchPlaceholder}>Search</Text>
                </View>
                <TouchableOpacity style={styles.exportBtn}>
                    <Text style={styles.exportText}>Export ▾</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.scanBtn}>
                    <Text style={styles.scanText}>Scan GRN </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => router.push('/inventory/swipe')}
                >
                    <Text style={styles.addText}>+ Add Item</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.tableHeader}>
                <View style={styles.checkboxCol} />
                    <Text style={[styles.headerCell, styles.codeCol]}>Item Code.</Text>
                    <Text style={[styles.headerCell, { width: 60 }]}>Photo</Text>
                    <Text style={[styles.headerCell, styles.nameCol]}>Item Name</Text>
                    <Text style={[styles.headerCell, styles.groupCol]}>Item Group</Text>
                    <Text style={[styles.headerCell, styles.dateCol]}>Last Purchase</Text>
                    <Text style={[styles.headerCell, styles.quantityCol]}>On Hand</Text>
                    <Text style={[styles.headerCell, styles.actionCol]}>Action</Text>
                </View>

            {loading ? (
                <View style={styles.center}>
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            ) : filteredItems.length === 0 ? (
                <View style={styles.center}>
                    <Text style={{ fontSize: 40, marginBottom: 12 }}></Text>
                    <Text style={styles.emptyTitle}>No items found</Text>
                    <Text style={styles.emptySubtitle}>
                  {activeTab === 'lowStock' ? 'All ingredients are well stocked' : ''}
                        </Text>
                </View>
            ) : (
                <FlatList
                    data={filteredItems}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    showsVerticalScrollIndicator={false}
                />
            )}

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Showing {filteredItems.length} of {items.length} entries
                </Text>
            </View>
        </>
        )}
    </View>

    <Modal
        visible={editItem !== null}
        transparent
        animationType="fade"
        onRequestClose={closeEdit}
    >
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit item</Text>
              <TouchableOpacity onPress={closeEdit}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
        
              <View style={styles.modalCol}>
                <Text style={styles.modalSectionTitle}>Basic information</Text>
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Ingredient name *</Text>
                  <TextInput style={styles.modalInput} value={editName} onChangeText={setEditName} placeholderTextColor="#8A9E85" />
                </View>
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Category *</Text>
                  <TextInput style={styles.modalInput} value={editCategory} onChangeText={setEditCategory} placeholderTextColor="#8A9E85" />
                </View>
                <View style={styles.modalRow}>
                  <View style={[styles.modalField, { flex: 1 }]}>
                    <Text style={styles.modalLabel}>Quantity *</Text>
                    <TextInput style={styles.modalInput} value={editQuantity} onChangeText={setEditQuantity} keyboardType="numeric" placeholderTextColor="#8A9E85" />
                  </View>
                  <View style={[styles.modalField, { flex: 1 }]}>
                    <Text style={styles.modalLabel}>Unit *</Text>
                    <TextInput style={styles.modalInput} value={editUnit} onChangeText={setEditUnit} placeholder="kg" placeholderTextColor="#8A9E85" />
                  </View>
                </View>
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Supplier (optional)</Text>
                  <TextInput style={styles.modalInput} placeholder="e.g Local Farm" placeholderTextColor="#8A9E85" />
                </View>
              </View>

          
              <View style={styles.modalCol}>
                <Text style={styles.modalSectionTitle}>Storage & expiry</Text>
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Expiry date *</Text>
                  <TextInput style={styles.modalInput} value={editExpiry} onChangeText={setEditExpiry} placeholder="2026-05-09" placeholderTextColor="#8A9E85" />
                </View>
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Storage location</Text>
                  <TextInput style={styles.modalInput} placeholder="e.g Shelf 1" placeholderTextColor="#8A9E85" />
                </View>
                <View style={styles.modalField}>
                  <Text style={styles.modalLabel}>Notes (optional)</Text>
                  <TextInput style={[styles.modalInput, styles.modalTextArea]} placeholder="Add any notes about this ingredient..." placeholderTextColor="#8A9E85" multiline numberOfLines={4} />
                </View>
                <View style={styles.modalActions}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={closeEdit}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveBtn} onPress={saveEdit}>
                    <Text style={styles.saveBtnText}>Done Edit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#F3F7F5', padding: 16 },
  card:             { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  center:           { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
  loadingText:      { color: '#8A9E85', fontSize: 14 },
  emptyTitle:       { fontSize: 18, fontWeight: '500', color: '#2C3328', marginBottom: 6 },
  emptySubtitle:    { fontSize: 14, color: '#8A9E85' },

  // Toolbar
  toolbar:          { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  spacer:           { flex: 1 },
  searchBox:        { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EDEFF2', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, gap: 6, borderWidth: 0.5, borderColor: '#EDEFF2', minWidth: 160 },
  searchIcon:       { fontSize: 13 },
  searchPlaceholder:{ fontSize: 13, color: '#AFA9A9' },
  exportBtn:        { backgroundColor: '#FFFFFF', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: '#3A8C5C' },
  exportText:       { fontSize: 13, color: '#3A8C5C', fontWeight: '500' },
  scanBtn:          { backgroundColor: '#C4B5FD', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  scanText:         { fontSize: 13, color: '#FFFFFF', fontWeight: '500' },
  addBtn:           { backgroundColor: '#005D47', borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  addText:          { fontSize: 13, color: '#FFFFFF', fontWeight: '500' },

  // Table
  tableHeader:      { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EAF5EE', paddingVertical: 12, paddingHorizontal: 8, borderRadius: 8, marginBottom: 4 },
  headerCell:       { fontSize: 13, fontWeight: '500', color: '#3A8C5C' },
  row:              { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 8 },
  separator:        { height: 0.5, backgroundColor: '#ECEAB9', marginHorizontal: 8 },
  checkboxCol:      { width: 32, alignItems: 'center' },
  codeCol:          { width: 80 },
  photoCol:         { width: 60, alignItems: 'center' },
  nameCol:          { flex: 1 },
  groupCol:         { width: 100 },
  dateCol:          { width: 110 },
  quantityCol:      { width: 80 },
  actionCol:        { width: 80, flexDirection: 'row', gap: 6, alignItems: 'center' },
  cell:             { fontSize: 13, color: '#2C3328' },
  checkbox:         { width: 18, height: 18, borderRadius: 4, borderWidth: 1.5, borderColor: '#ECEAB9', backgroundColor: '#F3F7F5' },
  itemImage:        { width: 34, height: 34, borderRadius: 17 },
  emoji:            { fontSize: 26 },
  editChipBtn:      { backgroundColor: '#EAF3DE', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 0.5, borderColor: '#3A8C5C', alignItems: 'center' },
  editChipText:     { fontSize: 12, color: '#005D47', fontWeight: '500', textAlign: 'center' },
  moreBtn:          { width: 28, height: 28, borderRadius: 14, borderWidth: 0.5, borderColor: '#ECEAB9', alignItems: 'center', justifyContent: 'center' },
  moreIcon:         { fontSize: 11, color: '#8A9E85', letterSpacing: 1 },
  footer:           { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTopWidth: 0.5, borderTopColor: '#ECEAB9', marginTop: 8 },
  footerText:       { fontSize: 12, color: '#8A9E85' },

  // Expiry badge
  badge:            { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText:        { fontSize: 11, fontWeight: '500' },

  // Section title
  sectionTitle:     { fontSize: 11, fontWeight: '500', letterSpacing: 0.7, color: '#8A9E85', marginBottom: 10, marginTop: 4 },

  // Expiring cards
  expiringCard:     { backgroundColor: '#FAFBF9', borderRadius: 12, padding: 16, marginBottom: 8, borderWidth: 0.5, borderColor: '#ECEAB9', borderLeftWidth: 3 },
  expiringCardTop:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  expiringCardInfo: { flex: 1, paddingRight: 8 },
  expiringCardName: { fontSize: 15, fontWeight: '500', color: '#2C3328', marginBottom: 3 },
  expiringCardMeta: { fontSize: 12, color: '#8A9E85' },
  expiringActions:  { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  actionChip:       { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 0.5 },
  actionChipText:   { fontSize: 12, fontWeight: '500' },
  recipeChip:       { backgroundColor: '#E1F5EE', borderColor: '#0F6E56' },
  freezeChip:       { backgroundColor: '#E6F1FB', borderColor: '#185FA5' },
  staffChip:        { backgroundColor: '#EAF3DE', borderColor: '#3B6D11' },
  wasteChip:        { backgroundColor: '#FCEBEB', borderColor: '#A32D2D' },

    // Stats — kompaktare
    statsRow:         { flexDirection: 'row', gap: 10, marginBottom: 20 },
    statCard:         { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 14, borderWidth: 0.5, borderColor: '#ECEAB9' },
    statLabel:        { fontSize: 11, color: '#8A9E85', marginBottom: 6 },
    statValue:        { fontSize: 22, fontWeight: '500', color: '#2C3328' },

// All good box — snyggare
allGoodBox:       { alignItems: 'center', paddingVertical: 40, marginBottom: 20 },
allGoodIcon:      { width: 80, height: 80, borderRadius: 40, backgroundColor: '#EAF3DE', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
allGoodTitle:     { fontSize: 20, fontWeight: '500', color: '#2C3328', marginBottom: 8 },
allGoodSubtitle:  { fontSize: 14, color: '#8A9E85', textAlign: 'center', lineHeight: 22 },

    // Tab bar — fixa den blå bordern
    tabBar:           { flexDirection: 'row', alignSelf: 'center', backgroundColor: '#F3F7F5', borderRadius: 12, padding: 3, marginBottom: 20, gap: 2 },
    tab:              { paddingHorizontal: 24, paddingVertical: 10, borderRadius: 10 },
    tabActive:        { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
    tabText:          { fontSize: 14, color: '#8A9E85', fontWeight: '500' },
    tabTextActive:    { color: '#2C3328', fontWeight: '500' },

  // Legend
  legend:           { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, borderWidth: 0.5, borderColor: '#ECEAB9', marginTop: 16 },
  legendTitle:      { fontSize: 14, fontWeight: '500', color: '#2C3328', marginBottom: 12 },
  legendRow:        { flexDirection: 'row', alignItems: 'flex-start', gap: 10, paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: '#ECEAB9' },
  legendIcon:       { fontSize: 18, width: 28 },
  legendLabel:      { fontSize: 13, fontWeight: '500', color: '#2C3328', marginBottom: 2 },
  legendDesc:       { fontSize: 12, color: '#8A9E85' },




// Modal
modalOverlay:      { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
modalCard:         { backgroundColor: '#FFFFFF', borderRadius: 20, width: '90%', maxWidth: 680, padding: 28, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 20, elevation: 10 },
modalHeader:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
modalTitle:        { fontSize: 15, fontWeight: '500', color: '#2C3328' },
modalClose:        { fontSize: 16, color: '#8A9E85', padding: 4 },
modalBody:         { flexDirection: 'row', gap: 24 },
modalCol:          { flex: 1 },
modalSectionTitle: { fontSize: 13, color: '#8A9E85', marginBottom: 14 },

// Varje fält är ett eget vitt kort med skugga
modalField:        { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
modalRow:          { flexDirection: 'row', gap: 12, marginBottom: 0 },
modalLabel:        { fontSize: 12, color: '#8A9E85', marginBottom: 8 },

// Input med ljus blå-grön bakgrund
modalInput:        { backgroundColor: '#EEF5F3', borderRadius: 8, padding: 12, fontSize: 14, color: '#2C3328', borderWidth: 0 },
modalTextArea:     { height: 100, textAlignVertical: 'top' },
modalActions:      { flexDirection: 'row', gap: 10, marginTop: 8 },
cancelBtn:         { flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 0.5, borderColor: '#ECEAB9', backgroundColor: '#FFFFFF' },
cancelBtnText:     { fontSize: 14, color: '#2C3328' },
saveBtn:           { flex: 2, backgroundColor: '#005D47', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
saveBtnText:       { fontSize: 14, color: '#FFFFFF', fontWeight: '500' },



});