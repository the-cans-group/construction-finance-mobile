import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    RefreshControl,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { SwipeListView } from 'react-native-swipe-list-view';
import {Storage} from "@/libs/storage";

const { width } = Dimensions.get('window');

const Badge = ({ label, color }) => (
    <View className={`bg-${color}-100 px-2 py-1 rounded-md`}>
        <Text className={`text-xs text-${color}-800 font-medium`}>{label}</Text>
    </View>
);

const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
};

export default function ProjectList() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [search, setSearch] = useState('');
    const router = useRouter();

    const fetchProjects = async () => {
        try {
            const storedProjects = await Storage.getItem('projects') || [];
            setProjects(storedProjects);
        } catch (err) {
            console.error('Error fetching projects:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleDelete = async (id) => {
        try {
            const updatedProjects = projects.filter((p) => p.id !== id);
            setProjects(updatedProjects);
            await Storage.setItem('projects', updatedProjects);

            Toast.show({
                type: 'success',
                text1: 'Deleted',
                text2: 'Project removed successfully ✅',
            });
        } catch (error) {
            console.error('Delete Project Error:', error);
        }
    };


    const filteredProjects = projects.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => router.push(`/projects/${item.id}`)}
            className="bg-white rounded-2xl shadow-lg p-4 mb-4 border border-gray-100"
        >
            <View className="flex-row justify-between items-center mb-2">
                <Text className="text-lg font-bold text-gray-900">{item.name}</Text>
                <Text className="text-xs text-gray-400">{formatDate(item.startDate)}</Text>
            </View>
            <Text className="text-sm text-gray-600 mb-3">
                {item.description || 'No description provided.'}
            </Text>
            <View className="flex-row gap-2 flex-wrap">
                <Badge label={item.status} color="blue" />
                <Badge label={item.projectType} color="green" />
                <Badge label={item.priority} color="red" />
            </View>
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
        <SafeAreaView className="flex-1 bg-gray-100 px-4 pt-6">
            <View className="flex-row items-center justify-between mb-4">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text className="text-2xl font-bold text-gray-900 flex-1 text-center">📋 Projects</Text>
                <TouchableOpacity
                    onPress={() => router.push('/projects/new')}
                    className="flex-row items-center bg-black px-4 py-2 rounded-xl"
                >
                    <Ionicons name="add-circle-outline" size={20} color="white" className="mr-2" />
                    <Text className="text-white font-medium">Add</Text>
                </TouchableOpacity>
            </View>

            <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search projects..."
                className="bg-white border border-gray-300 rounded-xl px-4 py-2 mb-4"
                placeholderTextColor="#999"
            />

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="black" />
                    <Text className="mt-2 text-gray-600">Loading projects...</Text>
                </View>
            ) : filteredProjects.length === 0 ? (
                <View className="flex-1 justify-center items-center">
                    <Text className="text-gray-500">No projects found.</Text>
                    <TouchableOpacity
                        onPress={() => router.push('/projects/new')}
                        className="mt-4 px-6 py-3 bg-black rounded-xl"
                    >
                        <Text className="text-white font-semibold">+ Create your first project</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <SwipeListView
                    data={filteredProjects}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    renderHiddenItem={renderHiddenItem}
                    rightOpenValue={-90}
                    disableRightSwipe
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => {
                        setRefreshing(true);
                        fetchProjects();
                    }} />}
                    contentContainerStyle={{ paddingBottom: 40 }}
                />
            )}
            <Toast />
        </SafeAreaView>
    );
}