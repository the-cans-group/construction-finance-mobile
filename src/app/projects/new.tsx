import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const schema = z.object({
    name: z.string().min(1, 'Project name is required'),
    description: z.string().optional(),
    projectType: z.enum(['Residential', 'Commercial', 'Industrial', 'Infrastructure']),
    startDate: z.date(),
    endDate: z.date().optional(),
    status: z.enum(['Planning', 'In Progress', 'On Hold', 'Completed']),
    priority: z.enum(['Low', 'Medium', 'High', 'Critical']),
    clientCompany: z.string().optional(),
    projectManager: z.string().optional(),
    location: z.string().optional(),
    estimatedBudget: z.coerce.number().optional(),
});

export default function NewProject() {
    const router = useRouter();
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            status: 'Planning',
            priority: 'Medium',
            projectType: 'Residential',
            startDate: new Date(),
        },
    });

    const [showDatePicker, setShowDatePicker] = useState(false);

    const onSubmit = async (data) => {
        try {
            await axios.post('https://your-api.com/projects', data);
            Toast.show({ type: 'success', text1: 'Success', text2: 'Project created successfully.' });
            router.replace('/dashboard');
        } catch (err) {
            Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to create project.' });
        }
    };

    const renderSelect = (label, name, options) => (
        <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, value } }) => (
                    <View className="flex-row flex-wrap gap-2">
                        {options.map((opt) => (
                            <TouchableOpacity
                                key={opt}
                                onPress={() => onChange(opt)}
                                className={`px-4 py-2 rounded-xl border ${
                                    value === opt ? 'bg-black' : 'bg-white'
                                } shadow-sm`}
                            >
                                <Text className={value === opt ? 'text-white font-semibold' : 'text-gray-800'}>
                                    {opt}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            />
        </View>
    );

    const renderInput = (label, name, placeholder, keyboardType = 'default') => (
        <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, value } }) => (
                    <View className="border border-gray-300 bg-white rounded-xl px-4 py-3 shadow-sm">
                        <TextInput
                            placeholder={placeholder}
                            placeholderTextColor="#9ca3af"
                            className="text-gray-900"
                            value={value?.toString() ?? ''}
                            onChangeText={onChange}
                        />
                    </View>
                )}
            />
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
                <ScrollView contentContainerStyle={{ padding: 24 }}>
                    {/* Header with back icon */}
                    <View className="flex-row items-center mb-6">
                        <TouchableOpacity onPress={() => router.back()} className="mr-3">
                            <Ionicons name="arrow-back" size={24} color="black" />
                        </TouchableOpacity>
                        <Text className="text-3xl font-extrabold text-gray-900">Create New Project</Text>
                    </View>

                    {renderInput('Project Name', 'name', 'Enter project name')}
                    {errors.name && <Text className="text-red-500 text-xs mb-3">{errors.name.message}</Text>}

                    {renderInput('Description', 'description', 'Short project description')}

                    {renderSelect('Project Type', 'projectType', ['Residential', 'Commercial', 'Industrial', 'Infrastructure'])}
                    {renderSelect('Status', 'status', ['Planning', 'In Progress', 'On Hold', 'Completed'])}
                    {renderSelect('Priority', 'priority', ['Low', 'Medium', 'High', 'Critical'])}

                    <Text className="text-sm font-medium text-gray-700 mb-2">Start Date</Text>
                    <Controller
                        control={control}
                        name="startDate"
                        render={({ field: { onChange, value } }) => (
                            <TouchableOpacity
                                className="border border-gray-300 rounded-xl bg-white px-4 py-3 shadow-sm mb-6"
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text className="text-gray-900">{value.toDateString()}</Text>
                                {showDatePicker && (
                                    <DateTimePicker
                                        value={value}
                                        mode="date"
                                        display="default"
                                        onChange={(event, selectedDate) => {
                                            setShowDatePicker(false);
                                            if (selectedDate) onChange(selectedDate);
                                        }}
                                    />
                                )}
                            </TouchableOpacity>
                        )}
                    />

                    {renderInput('Client Company', 'clientCompany', 'e.g. ACME Ltd.')}
                    {renderInput('Project Manager', 'projectManager', 'e.g. John Doe')}
                    {renderInput('Location', 'location', 'City or Region')}
                    {renderInput('Estimated Budget ($)', 'estimatedBudget', 'e.g. 150000', 'numeric')}

                    <TouchableOpacity
                        onPress={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="bg-black rounded-xl py-4 mt-4"
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text className="text-center text-white font-semibold text-base">💾 Save Project</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
            <Toast />
        </SafeAreaView>
    );
}
