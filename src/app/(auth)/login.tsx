import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
    ActivityIndicator,
} from 'react-native';
import {Storage} from "@/libs/storage";
import { useRouter } from "expo-router";

export default function Login() {
    const [email, setEmail] = useState('john@example.com');
    const [password, setPassword] = useState('john@example.com');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleFakeLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in both email and password.');
            return;
        }

        try {
            setLoading(true);

            const token = 'token-1234567890';
            const userData = {
                id: 1,
                name: 'John Doe',
                email: email,
            };

            await Storage.setItem('accessUser', {
                id: 1,
                name: 'John Doe',
                email: 'john@example.com',
            });
            await Storage.setItem('projects', [
                {
                    id: 1,
                    name: "Finance App UI",
                    description: "UI design and development for finance tracking application.",
                    projectType: "Commercial",
                    startDate: new Date('2024-04-01'),
                    endDate: new Date('2024-08-30'),
                    status: "In Progress",
                    priority: "High",
                    clientCompany: "FinTech Solutions",
                    projectManager: "Alice Johnson",
                    location: "New York, USA",
                    estimatedBudget: 75000,
                },
                {
                    id: 2,
                    name: "Tower B Costing",
                    description: "Cost estimation and financial planning for Tower B project.",
                    projectType: "Infrastructure",
                    startDate: new Date('2024-03-15'),
                    endDate: new Date('2025-01-20'),
                    status: "Pending Review",
                    priority: "Critical",
                    clientCompany: "MegaBuild Corp",
                    projectManager: "Robert Smith",
                    location: "Los Angeles, USA",
                    estimatedBudget: 500000,
                },
                {
                    id: 3,
                    name: "Bridge Construction",
                    description: "Steel bridge construction over the Red River.",
                    projectType: "Infrastructure",
                    startDate: new Date('2024-05-10'),
                    endDate: new Date('2025-06-30'),
                    status: "Completed",
                    priority: "High",
                    clientCompany: "City Transport Authority",
                    projectManager: "Maria Garcia",
                    location: "Dallas, USA",
                    estimatedBudget: 1200000,
                }
            ]);
            await Storage.setItem('subcontractors', [
                { id: 1, name: 'SteelWorks Inc.', specialty: 'Steel Fabrication', contact: 'John Doe' },
                { id: 2, name: 'Concrete Masters', specialty: 'Concrete Pouring', contact: 'Jane Smith' },
                { id: 3, name: 'Roofing Pro', specialty: 'Roofing', contact: 'Mike Johnson' },
            ]);


            await Storage.setItem('notifications', [
                { id: 1, message: "Invoice #1221 approved" },
                { id: 2, message: "New message from Sarah" },
                { id: 3, message: "Project deadline updated" },
            ]);

            router.replace('/(dashboard)');
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert('Error', 'Something went wrong. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            className="flex-1 bg-white"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-1 justify-center px-6">
                        <View className="items-center mb-10">
                            <Image
                                source={require('../../assets/icon.png')}
                                className="w-28 h-28"
                                resizeMode="contain"
                            />
                            <Text className="text-xl font-bold text-gray-800">
                                Construction Finance
                            </Text>
                        </View>

                        <Text className="text-3xl font-semibold text-gray-900 text-center mb-2">
                            Welcome 👋
                        </Text>
                        <Text className="text-base text-gray-500 text-center mb-8">
                            Sign in to continue
                        </Text>

                        <TextInput
                            className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 mb-4 text-gray-800"
                            placeholder="Email"
                            placeholderTextColor="#A1A1AA"
                            keyboardType="email-address"
                            value={email}
                            onChangeText={setEmail}
                        />

                        <TextInput
                            className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 mb-6 text-gray-800"
                            placeholder="Password"
                            placeholderTextColor="#A1A1AA"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />

                        <TouchableOpacity
                            className="bg-black rounded-xl py-4 items-center justify-center"
                            onPress={handleFakeLogin}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text className="text-white font-medium text-base">Continue</Text>
                            )}
                        </TouchableOpacity>

                        <Text className="text-center text-gray-500 mt-6 mb-8">
                            Don’t have an account?{' '}
                            <Text className="text-black font-semibold">Sign up</Text>
                        </Text>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
