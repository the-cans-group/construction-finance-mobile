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
    Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Storage } from '@/libs/storage';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';

export default function ProjectDetailEdit() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const projects = await Storage.getItem('projects');
                if (projects) {
                    const foundProject = projects.find((p: any) => p.id === parseInt(id as string));
                    setProject(foundProject);
                    setFormData(foundProject);
                }
            } catch (error) {
                console.error('Failed to fetch project:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    const handleCancel = () => {
        setFormData(project);
        setEditMode(false);
    };
    const handleSave = async () => {
        try {
            const projects = await Storage.getItem('projects');
            const updatedProjects = projects.map((p: any) =>
                p.id === parseInt(id as string) ? { ...p, ...formData } : p
            );
            await Storage.setItem('projects', updatedProjects);
            Toast.show({ type: 'success', text1: 'Success', text2: 'Project updated successfully.' });
            router.replace('/projects');
        } catch (error) {
            console.error('Failed to update project:', error);
            Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to update project.' });
        }
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    if (!project) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <Text className="text-gray-500">Project not found.</Text>
            </View>
        );
    }

    const renderField = (label: string, key: string, placeholder: string, keyboardType = 'default') => (
        <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
            {editMode ? (
                <TextInput
                    value={formData[key]?.toString() || ''}
                    onChangeText={(text) => setFormData({ ...formData, [key]: text })}
                    placeholder={placeholder}
                    placeholderTextColor="#9ca3af"
                    className="border border-gray-300 bg-white rounded-xl px-4 py-3 shadow-sm text-gray-900"
                    keyboardType={keyboardType}
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
                                {editMode ? 'Edit Project' : 'Project Details'}
                            </Text>
                        </View>

                        {editMode ? (
                            <View className="flex-row items-center">
                                <TouchableOpacity onPress={handleCancel} className="mr-3">
                                    <Text className="text-red-500 font-semibold">Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <TouchableOpacity onPress={() => setEditMode(true)}>
                                <Ionicons name="create-outline" size={24} color="black" />
                            </TouchableOpacity>
                        )}
                    </View>


                    {/* Form */}
                    {renderField('Project Name', 'name', 'Enter project name')}
                    {renderField('Description', 'description', 'Project description')}
                    {renderField('Project Type', 'projectType', 'e.g. Residential')}
                    {renderField('Start Date', 'startDate', 'Start date (e.g. 2024-01-01)')}
                    {renderField('End Date', 'endDate', 'End date (optional)')}
                    {renderField('Status', 'status', 'Planning / In Progress')}
                    {renderField('Priority', 'priority', 'Low / Medium / High / Critical')}
                    {renderField('Client Company', 'clientCompany', 'e.g. ACME Ltd.')}
                    {renderField('Project Manager', 'projectManager', 'e.g. John Doe')}
                    {renderField('Location', 'location', 'City or Region')}
                    {renderField('Estimated Budget', 'estimatedBudget', 'e.g. 150000', 'numeric')}

                    {/* Save Button */}
                    {editMode && (
                        <TouchableOpacity
                            onPress={handleSave}
                            className="bg-black rounded-xl py-4 mt-4"
                        >
                            <Text className="text-center text-white font-semibold text-base">
                                💾 Save Changes
                            </Text>
                        </TouchableOpacity>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
            <Toast />
        </SafeAreaView>
    );
}
