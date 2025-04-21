import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { SwipeListView } from 'react-native-swipe-list-view';

const fakeSubcontractors = [
    { id: 1, name: 'SteelWorks Inc.', specialty: 'Steel Fabrication', contact: 'John Doe' },
    { id: 2, name: 'Concrete Masters', specialty: 'Concrete Pouring', contact: 'Jane Smith' },
    { id: 3, name: 'Roofing Pro', specialty: 'Roofing', contact: 'Mike Johnson' },
];

export default function SubcontractorList() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');
    const router = useRouter();

    const fetchSubcontractors = async () => {
        try {
            setData(fakeSubcontractors);
        } catch (err) {
            console.error('Error fetching subcontractors:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchSubcontractors();
    }, []);

    const handleDelete = (id) => {
        setData((prev) => prev.filter((item) => item.id !== id));
        Toast.show({
            type: 'success',
            text1: 'Deleted',
            text2: 'Subcontractor removed successfully ✅',
        });
    };

    const filtered = data.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => router.push(`/subcontractors/${item.id}`)}
            className="bg-white rounded-2xl shadow-md p-4 mb-4 border border-gray-100"
        >
            <Text className="text-lg font-bold text-gray-900">{item.name}</Text>
            <Text className="text-sm text-gray-600">{item.specialty}</Text>
            <Text className="text-xs text-gray-500 mt-1">Contact: {item.contact}</Text>
        </TouchableOpacity>
    );

    const renderHiddenItem = (data) => (
        <View className="flex-1 justify-center items-end px-2 mb-4">
            <TouchableOpacity
                onPress={() => handleDelete(data.item.id)}
                className="bg-red-600 w-[70px] h-full justify-center items-center rounded-r-2xl"
            >
                <Ionicons name="trash" size={22} color="white" />
                <Text className="text-white text-sm mt-1">Delete</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-100 px-4 pt-6">
            <View className="flex-row items-center justify-between mb-4">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-2xl font-bold text-gray-900 flex-1 text-center">🔧 Subcontractors</Text>
                <TouchableOpacity
                    onPress={() => router.push('/subcontractors/new')}
                    className="flex-row items-center bg-black px-4 py-2 rounded-xl"
                >
                    <Ionicons name="add-circle-outline" size={20} color="white" className="mr-2" />
                    <Text className="text-white font-medium">Add</Text>
                </TouchableOpacity>
            </View>

            <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search subcontractors..."
                className="bg-white border border-gray-300 rounded-xl px-4 py-2 mb-4"
                placeholderTextColor="#999"
            />

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="black" />
                    <Text className="mt-2 text-gray-600">Loading...</Text>
                </View>
            ) : filtered.length === 0 ? (
                <View className="flex-1 justify-center items-center">
                    <Text className="text-gray-500">No subcontractors found.</Text>
                    <TouchableOpacity
                        onPress={() => router.push('/subcontractors/new')}
                        className="mt-4 px-6 py-3 bg-black rounded-xl"
                    >
                        <Text className="text-white font-semibold">+ Add your first subcontractor</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <SwipeListView
                    data={filtered}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    renderHiddenItem={renderHiddenItem}
                    rightOpenValue={-90}
                    disableRightSwipe
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {
                        setRefreshing(true);
                        fetchSubcontractors();
                    }} />}
                    contentContainerStyle={{ paddingBottom: 40 }}
                />
            )}
            <Toast />
        </SafeAreaView>
    );
}