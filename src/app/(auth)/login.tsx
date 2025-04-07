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
    Keyboard, Alert,
} from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {tls} from "node-forge";
import {useRouter} from "expo-router";
import { useAuth } from '@/hooks/useAuth';
import { ActivityIndicator } from 'react-native';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        try {
            setLoading(true);
            const res = await login({ email, password });

            if (res.status && res.data?.token) {
                await AsyncStorage.setItem('accessToken', res.data.token);
                await AsyncStorage.setItem('accessUser', JSON.stringify(res.data.user));
                router.replace('/(dashboard)');
            } else {
                Alert.alert('Login Failed', res.message || 'Invalid credentials');
            }
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
                            onPress={handleLogin}
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
