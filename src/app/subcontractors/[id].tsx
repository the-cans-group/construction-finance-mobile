import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import { Storage } from '@/libs/storage';

export default function SubcontractorDetail() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [subcontractor, setSubcontractor] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        const fetchSubcontractor = async () => {
            try {
                const stored = await Storage.getItem('subcontractors') || [];
                const found = stored.find((s: any) => s.id === parseInt(id as string));
                setSubcontractor(found);
                setFormData(found);
            } catch (err) {
                console.error('Error fetching subcontractor:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSubcontractor();
    }, [id]);

    const handleSave = async () => {
        try {
            const subcontractors = await Storage.getItem('subcontractors') || [];
            const updated = subcontractors.map((s: any) =>
                s.id === parseInt(id as string) ? { ...s, ...formData } : s
            );
            await Storage.setItem('subcontractors', updated);
            Toast.show({ type: 'success', text1: 'Saved', text2: 'Subcontractor updated.' });
            setEditMode(false);
            setSubcontractor(formData);
        } catch (err) {
            console.error('Error saving subcontractor:', err);
            Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to save subcontractor.' });
        }
    };

    const handleCancel = () => {
        setFormData(subcontractor);
        setEditMode(false);
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="black" />
            </View>
        );
    }

    if (!subcontractor) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <Text className="text-gray-500">Subcontractor not found.</Text>
            </View>
        );
    }

    const renderField = (label: string, key: string, placeholder: string) => (
        <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
            {editMode ? (
                <TextInput
                    className="border border-gray-300 bg-white rounded-xl px-4 py-3 text-gray-900"
                    placeholder={placeholder}
                    placeholderTextColor="#9ca3af"
                    value={formData[key] || ''}
                    onChangeText={(text) => setFormData({ ...formData, [key]: text })}
                />
            ) : (
                <View className="border border-gray-200 rounded-xl px-4 py-3 bg-gray-50">
                    <Text className="text-gray-900">{formData[key] || 'Not Provided'}</Text>
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
                <ScrollView contentContainerStyle={{ padding: 24 }}>
                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-6">
                        <View className="flex-row items-center">
                            <TouchableOpacity onPress={() => editMode ? handleCancel() : router.back()} className="mr-3">
                                <Ionicons name="arrow-back" size={24} color="black" />
                            </TouchableOpacity>
                            <Text className="text-3xl font-extrabold text-gray-900">
                                {editMode ? 'Edit Subcontractor' : 'Subcontractor Details'}
                            </Text>
                        </View>

                        {editMode ? (
                            <View className="flex-row items-center">
                                <TouchableOpacity onPress={handleCancel} className="mr-3">
                                    <Text className="text-red-500 font-semibold">Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleSave}>
                                    <Text className="text-green-600 font-semibold">Save</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity onPress={() => setEditMode(true)}>
                                <Ionicons name="create-outline" size={24} color="black" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Fields */}
                    {renderField('Name', 'name', 'Subcontractor Name')}
                    {renderField('Specialty', 'specialty', 'Specialty')}
                    {renderField('Contact Person', 'contact', 'Contact Person')}
                </ScrollView>
            </KeyboardAvoidingView>
            <Toast />
        </SafeAreaView>
    );
}
