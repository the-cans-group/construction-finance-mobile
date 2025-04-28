import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {Storage} from "@/libs/storage";
export default function Dashboard() {
    const { top } = useSafeAreaInsets();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [subcontractors, setSubcontractors] = useState<any[]>([]);
    const [projects, setProjects] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
        fetchUser();
        fetchProjects();
        fetchNotifications();
    }, []);

    const fetchData = async () => {
        try {
            const projectList = await Storage.getItem('projects') || [];
            const subcontractorList = await Storage.getItem('subcontractors') || [];

            setProjects(projectList);
            setSubcontractors(subcontractorList);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };
    const fetchUser = async () => {
        try {
            const userData = await Storage.getItem('accessUser');
            if (userData) {
                setUser(userData);
            }
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        } finally {
            setLoading(false);
        }
    };
    const fetchProjects = async () => {
        try {
            const storedProjects = await Storage.getItem('projects');
            if (storedProjects) {
                setProjects(storedProjects);
            }
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        }
    };
    const fetchNotifications = async () => {
        try {
            const storedNotifications = await Storage.getItem('notifications');
            if (storedNotifications) {
                setNotifications(storedNotifications);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    const cards = [
        { label: 'Balance', value: '$12,540' },
        { label: 'Projects', value: `${projects.length} Active` },
        { label: 'Subcontractors', value: `${subcontractors.length} Total` },
        { label: 'Revenue', value: '$98,210' },
        { label: 'Expenses', value: '$13,250' },
        { label: 'Tasks', value: '6 To-Do' },
    ];

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white" style={{ paddingTop: top }}>
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {/* Üst Bar */}
                <View className="flex-row items-center justify-between mb-6">
                    <View>
                        <Text className="text-sm text-gray-500">Welcome back</Text>
                        <Text className="text-2xl font-bold text-gray-900">
                            {user?.name || 'Guest'} 👷‍♂️
                        </Text>
                    </View>
                    <Image
                        source={require('../../assets/icon.png')}
                        className="w-10 h-10 rounded-full bg-gray-200"
                    />
                </View>

                {/* Hızlı Kartlar */}<View className="mb-6">
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 12, paddingRight: 12, paddingTop: 5, paddingBottom: 5 }}
                >
                    {cards.map((card) => (
                        <DashboardCard key={card.label} label={card.label} value={card.value} />
                    ))}
                </ScrollView>
            </View>


                {/* Quick Actions */}
                <View className="mb-6">
                    <Text className="text-lg font-semibold text-gray-800 mb-2">
                        Quick Actions
                    </Text>

                    <View className="flex-row justify-between gap-4">
                        <ActionButton onPress={() => router.push('/projects')} label="Project" />
                        <ActionButton onPress={() => router.push('/subcontractors')} label="Sub Contractor" />
                        <ActionButton onPress={() => router.push('/projects/new')} label="View Reports" />
                    </View>
                </View>

                {/* My Projects */}
                <View className="mb-6">
                    <Text className="text-lg font-semibold text-gray-800 mb-3">
                        My Projects
                    </Text>

                    {projects.length > 0 ? (
                        projects.map((project: any) => (
                            <ProjectItem
                                key={project.id}
                                name={project.name}
                                status={project.status}
                                onPress={() => router.push(`/projects/${project.id}`)}
                            />
                        ))
                    ) : (
                        <Text className="text-gray-500">No projects available.</Text>
                    )}

                </View>

                {/* Notifications */}
                <View className="mb-8">
                    <Text className="text-lg font-semibold text-gray-800 mb-3">
                        Notifications
                    </Text>

                    {notifications.length > 0 ? (
                        notifications.map((n: any) => (
                            <NotificationItem key={n.id} message={n.message} />
                        ))
                    ) : (
                        <Text className="text-gray-500">No notifications available.</Text>
                    )}
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

function ProjectItem({ name, status, onPress }: { name: string; status: string; onPress?: () => void }) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className="border border-gray-200 rounded-xl px-4 py-3 mb-2 bg-white"
        >
            <Text className="text-gray-900 font-medium">{name}</Text>
            <Text className="text-sm text-gray-500 mt-1">{status}</Text>
        </TouchableOpacity>
    );
}


function NotificationItem({ message }: { message: string }) {
    return (
        <View className="bg-gray-50 rounded-xl px-4 py-3 mb-2 border border-gray-100">
            <Text className="text-gray-800">{message}</Text>
        </View>
    );
}
