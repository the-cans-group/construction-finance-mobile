import React, { useState, useRef } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, FlatList, SafeAreaView, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';

export default function ProgressPaymentScreen() {
    const [items, setItems] = useState([]);
    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unitPrice, setUnitPrice] = useState('');
    const quantityRef = useRef(null);
    const priceRef = useRef(null);
    const router = useRouter();

    const addItem = () => {
        if (!description || !quantity || !unitPrice || isNaN(+quantity) || isNaN(+unitPrice)) {
            Alert.alert('Hatalı Giriş', 'Lütfen tüm alanları doğru doldurun.');
            return;
        }

        const newItem = {
            id: Date.now(),
            description: description.trim(),
            quantity: parseFloat(quantity),
            unitPrice: parseFloat(unitPrice),
            total: parseFloat(quantity) * parseFloat(unitPrice),
            date: format(new Date(), 'yyyy-MM-dd HH:mm'),
            paid: false,
        };

        setItems([newItem, ...items]);
        setDescription('');
        setQuantity('');
        setUnitPrice('');
    };

    const togglePaid = (id) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, paid: !item.paid } : item));
    };

    const deleteItem = (id) => {
        Alert.alert("Silmek istediğinize emin misiniz?", "", [
            { text: "İptal", style: "cancel" },
            {
                text: "Sil", style: "destructive", onPress: () => {
                    setItems(prev => prev.filter(item => item.id !== id));
                }
            }
        ]);
    };

    const total = items.reduce((sum, item) => sum + item.total, 0);
    const totalPaid = items.filter(i => i.paid).reduce((sum, i) => sum + i.total, 0);
    const totalUnpaid = total - totalPaid;

    return (
        <SafeAreaView className="flex-1 bg-white p-4">
            {/* Header */}
            <View className="flex-row items-center mb-4">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-800 ml-4">📑 Hakediş ve Ödeme Planı</Text>
            </View>

            {/* Form */}
            <View className="mb-4">
                <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="İş Kalemi (örn: Kalıp İşçiliği)"
                    className="border rounded-xl px-4 py-3 mb-2"
                    returnKeyType="next"
                    onSubmitEditing={() => quantityRef.current.focus()}
                />
                <TextInput
                    ref={quantityRef}
                    value={quantity}
                    onChangeText={setQuantity}
                    placeholder="Miktar (örn: 150)"
                    keyboardType="numeric"
                    className="border rounded-xl px-4 py-3 mb-2"
                    returnKeyType="next"
                    onSubmitEditing={() => priceRef.current.focus()}
                />
                <TextInput
                    ref={priceRef}
                    value={unitPrice}
                    onChangeText={setUnitPrice}
                    placeholder="Birim Fiyat (örn: 300)"
                    keyboardType="numeric"
                    className="border rounded-xl px-4 py-3 mb-2"
                    returnKeyType="done"
                />
                <TouchableOpacity onPress={addItem} className="bg-black py-3 rounded-xl items-center">
                    <Text className="text-white font-semibold">➕ Ekle</Text>
                </TouchableOpacity>
            </View>

            {/* List */}
            <FlatList
                data={items}
                keyExtractor={item => item.id.toString()}
                ListEmptyComponent={<Text className="text-gray-400 text-center mt-6">Henüz hakediş yok.</Text>}
                renderItem={({ item }) => (
                    <View className="border rounded-xl px-4 py-3 mb-3 bg-gray-50">
                        <View className="flex-row justify-between items-center">
                            <View className="flex-1">
                                <Text className="font-bold text-gray-800">{item.description}</Text>
                                <Text className="text-sm text-gray-600">
                                    {item.quantity} x {item.unitPrice} = {item.total.toFixed(2)} ₺
                                </Text>
                                <Text className="text-xs text-gray-500 mt-1">{item.date}</Text>
                                <Text className={`text-xs font-medium ${item.paid ? 'text-green-600' : 'text-red-600'}`}>
                                    {item.paid ? '✓ Ödendi' : '✗ Ödenmedi'}
                                </Text>
                            </View>
                            <View className="items-end gap-2">
                                <TouchableOpacity onPress={() => togglePaid(item.id)}>
                                    <Ionicons name={item.paid ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={item.paid ? 'green' : 'gray'} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => deleteItem(item.id)}>
                                    <Ionicons name="trash" size={22} color="gray" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        {total > 0 && (
                            <Text className="text-xs text-gray-500 mt-1">
                                Toplamın %{((item.total / total) * 100).toFixed(1)}’i
                            </Text>
                        )}
                    </View>
                )}
                ListFooterComponent={
                    items.length > 0 && (
                        <View className="mt-4">
                            <Text className="text-right text-base font-semibold text-green-700">
                                Ödenen: {totalPaid.toFixed(2)} ₺
                            </Text>
                            <Text className="text-right text-base font-semibold text-red-700">
                                Ödenmeyen: {totalUnpaid.toFixed(2)} ₺
                            </Text>
                            <Text className="text-right text-lg font-bold text-gray-900 mt-2">
                                Genel Toplam: {total.toFixed(2)} ₺
                            </Text>
                        </View>
                    )
                }
            />
        </SafeAreaView>
    );
}
