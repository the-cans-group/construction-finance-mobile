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
import { Storage } from '@/libs/storage';

export default function SubcontractorList() {
    const router = useRouter();
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchSubcontractors();
    }, []);

    const fetchSubcontractors = async () => {
        try {
            const stored = await Storage.getItem('subcontractors') || [];
            setData(stored);
        } catch (error) {
            console.error('Error fetching subcontractors:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const updated = data.filter((item) => item.id !== id);
            setData(updated);
            await Storage.setItem('subcontractors', updated);

            Toast.show({
                type: 'success',
                text1: 'Deleted',
                text2: 'Subcontractor removed successfully ✅',
            });
        } catch (error) {
            console.error('Error deleting subcontractor:', error);
        }
    };

    const filtered = data.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            onPress={() => router.push(`/subcontractors/${item.id}`)}
            className="bg-white rounded-2xl p-4 mb-4 border border-gray-200 shadow-sm"
        >
            <Text className="text-lg font-bold text-gray-900">{item.name}</Text>
            <Text className="text-sm text-gray-600">{item.specialty}</Text>
            <Text className="text-xs text-gray-500 mt-1">Contact: {item.contact}</Text>
        </TouchableOpacity>
    );

    const renderHiddenItem = (data) => (
        <View className="bg-red-600 justify-center items-end pr-6 rounded-3xl mb-4 ">
            <TouchableOpacity
                onPress={() => handleDelete(data.item.id)}
                style={{ width: 70, height: '100%' }}
                className="bg-red-600 justify-center items-center rounded-r-2xl"
            >
                <Ionicons name="trash" size={22} color="white" />
                <Text className="text-white text-sm mt-1">Delete</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <View className="flex-row items-center justify-between px-4 pt-6 mb-4">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>

                <Text className="text-2xl font-bold text-gray-900 flex-1 text-center">
                    🔧 Subcontractors
                </Text>

                <TouchableOpacity
                    onPress={() => router.push('/subcontractors/new')}
                    className="flex-row items-center bg-black px-4 py-2 rounded-xl"
                >
                    <Ionicons name="add-circle-outline" size={20} color="white" className="mr-2" />
                    <Text className="text-white font-medium">Add</Text>
                </TouchableOpacity>
            </View>

            {/* Search */}
            <View className="px-4">
                <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Search subcontractors..."
                    placeholderTextColor="#999"
                    className="bg-white border border-gray-300 rounded-xl px-4 py-2 mb-4"
                />
            </View>

            {/* Content */}
            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="black" />
                    <Text className="mt-2 text-gray-600">Loading...</Text>
                </View>
            ) : filtered.length === 0 ? (
                <View className="flex-1 justify-center items-center px-4">
                    <Text className="text-gray-500 mb-4">No subcontractors found.</Text>
                    <TouchableOpacity
                        onPress={() => router.push('/subcontractors/new')}
                        className="bg-black px-6 py-3 rounded-xl"
                    >
                        <Text className="text-white font-semibold">+ Add Subcontractor</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <SwipeListView
                    data={filtered}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    renderHiddenItem={renderHiddenItem}
                    rightOpenValue={-80}
                    disableRightSwipe
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => {
                                setRefreshing(true);
                                fetchSubcontractors();
                            }}
                        />
                    }
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
                />
            )}
            <Toast />
        </SafeAreaView>
    );
}
