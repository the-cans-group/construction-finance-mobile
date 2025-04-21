import React from 'react';
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
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';

const schema = z.object({
    name: z.string().min(1, 'Subcontractor name is required'),
    specialty: z.string().min(1, 'Specialty is required'),
    contact: z.string().min(1, 'Contact person is required'),
});

type FormData = z.infer<typeof schema>;

export default function AddSubcontractor() {
    const router = useRouter();
    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        try {
            // Fake API request
            console.log('New Subcontractor:', data);
            Toast.show({
                type: 'success',
                text1: 'Success',
                text2: 'Subcontractor added successfully ✅',
            });
            reset();
            router.replace('/subcontractors');
        } catch (err) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to save subcontractor ❌',
            });
        }
    };

    const renderField = (label: string, name: keyof FormData, placeholder: string) => (
        <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, value } }) => (
                    <TextInput
                        className="border border-gray-300 bg-white rounded-xl px-4 py-3 text-gray-900"
                        placeholder={placeholder}
                        placeholderTextColor="#9ca3af"
                        value={value}
                        onChangeText={onChange}
                    />
                )}
            />
            {errors[name] && (
                <Text className="text-red-500 text-xs mt-1">{errors[name]?.message}</Text>
            )}
        </View>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1"
            >
                <ScrollView contentContainerStyle={{ padding: 24 }}>
                    <Text className="text-3xl font-extrabold text-gray-900 mb-6">Add Subcontractor</Text>

                    {renderField('Name', 'name', 'e.g. Concrete Masters')}
                    {renderField('Specialty', 'specialty', 'e.g. Concrete Pouring')}
                    {renderField('Contact Person', 'contact', 'e.g. Jane Smith')}

                    <TouchableOpacity
                        onPress={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="bg-black rounded-xl py-4 mt-4"
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text className="text-center text-white font-semibold text-base">
                                Save Subcontractor
                            </Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
            <Toast />
        </SafeAreaView>
    );
}
