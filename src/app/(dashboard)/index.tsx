import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    SafeAreaView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {router} from "expo-router";

export default function Dashboard() {
    const { top } = useSafeAreaInsets();

    return (
        <SafeAreaView className="flex-1 bg-white" style={{ paddingTop: top }}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {/* Üst Bar */}
                <View className="flex-row items-center justify-between mb-6">
                    <View>
                        <Text className="text-sm text-gray-500">Welcome back</Text>
                        <Text className="text-2xl font-bold text-gray-900">Uğur CAN 👷‍♂️</Text>
                    </View>
                    <Image
                        source={require('../../assets/icon.png')}
                        className="w-10 h-10 rounded-full bg-gray-200"
                    />
                </View>

                {/* Hızlı Kartlar */}
                <View className="mb-6">
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ gap: 12, paddingRight: 12, paddingTop:5, paddingBottom:5  }}
                    >
                        <DashboardCard label="Balance" value="$12,540" />
                        <DashboardCard label="Projects" value="4 Active" />
                        <DashboardCard label="Alerts" value="2 🔔" />
                        <DashboardCard label="Revenue" value="$98,210" />
                        <DashboardCard label="Expenses" value="$13,250" />
                        <DashboardCard label="Tasks" value="6 To-Do" />
                    </ScrollView>
                </View>

                {/* Quick Actions */}
                <View className="mb-6">
                    <Text className="text-lg font-semibold text-gray-800 mb-2">
                        Quick Actions
                    </Text>

                    <View className="flex-row justify-between gap-4">
                        <ActionButton  onPress={() => router.push('/projects')}  label="Project" />
                        <ActionButton  onPress={() => router.push('/subcontractors')}  label="Sub Contractor" />
                        <ActionButton  onPress={() => router.push('/projects/new')}  label="View Reports" />
                    </View>
                </View>

                {/* My Projects */}
                <View className="mb-6">
                    <Text className="text-lg font-semibold text-gray-800 mb-3">
                        My Projects
                    </Text>
                    <ProjectItem name="Finance App UI" status="In Progress" />
                    <ProjectItem name="Tower B Costing" status="Pending Review" />
                </View>

                {/* Notifications */}
                <View className="mb-8">
                    <Text className="text-lg font-semibold text-gray-800 mb-3">
                        Notifications
                    </Text>
                    <NotificationItem message="Invoice #1221 approved" />
                    <NotificationItem message="New message from Sarah" />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function DashboardCard({ label, value }: { label: string; value: string }) {
    return (
        <View className="bg-gray-100 rounded-xl px-4 py-3 w-[160px] shadow-sm">
            <Text className="text-xs text-gray-500">{label}</Text>
            <Text className="text-lg font-semibold text-gray-900">{value}</Text>
        </View>
    );
}


function ActionButton({ label, onPress }: { label: string; onPress?: () => void }) {
    return (
        <TouchableOpacity onPress={onPress} className="flex-1 bg-black rounded-xl py-4">
            <Text className="text-center text-white font-medium">{label}</Text>
        </TouchableOpacity>
    );
}

function ProjectItem({ name, status }: { name: string; status: string }) {
    return (
        <View className="border border-gray-200 rounded-xl px-4 py-3 mb-2">
            <Text className="text-gray-900 font-medium">{name}</Text>
            <Text className="text-sm text-gray-500 mt-1">{status}</Text>
        </View>
    );
}

function NotificationItem({ message }: { message: string }) {
    return (
        <View className="bg-gray-50 rounded-xl px-4 py-3 mb-2 border border-gray-100">
            <Text className="text-gray-800">{message}</Text>
        </View>
    );
}
