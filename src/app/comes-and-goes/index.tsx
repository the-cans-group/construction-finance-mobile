import React, { useEffect, useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, FlatList, SafeAreaView,
    KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, isToday, isThisWeek, parse } from 'date-fns';
import { Storage } from '@/libs/storage';
import {useRouter} from "expo-router";

const categories = ['Salary', 'Groceries', 'Transport', 'Other'];
const timeFilters = ['All', 'Today', 'This Week'];

export default function IncomeExpenseTracker(dateString: string) {
    const router = useRouter();
    const [records, setRecords] = useState([]);
    const [type, setType] = useState<'income' | 'expense'>('income');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(categories[0]);
    const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
    const [timeFilter, setTimeFilter] = useState('All');
    const [editingId, setEditingId] = useState<number | null>(null);

    useEffect(() => {
        loadRecords();
    }, []);

    const loadRecords = async () => {
        const data = await Storage.getItem('financeRecords');
        setRecords(data || []);
    };

    const saveRecord = async () => {
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid number.');
            return;
        }

        if (!description.trim()) {
            Alert.alert('Missing Description', 'Please enter a description.');
            return;
        }

        if (editingId) {
            const updated = records.map((r) =>
                r.id === editingId
                    ? { ...r, type, amount: parseFloat(amount), description: description.trim(), category }
                    : r
            );
            await Storage.setItem('financeRecords', updated);
            setRecords(updated);
        } else {
            const newRecord = {
                id: Date.now(),
                type,
                category,
                amount: parseFloat(amount),
                description: description.trim(),
                date: format(new Date(), 'yyyy-MM-dd HH:mm'),
            };
            const updated = [newRecord, ...records];
            await Storage.setItem('financeRecords', updated);
            setRecords(updated);
        }

        resetForm();
    };

    const deleteRecord = async (id: number) => {
        const updated = records.filter((r) => r.id !== id);
        await Storage.setItem('financeRecords', updated);
        setRecords(updated);
    };

    const startEdit = (record: any) => {
        setEditingId(record.id);
        setAmount(record.amount.toString());
        setDescription(record.description);
        setCategory(record.category);
        setType(record.type);
    };

    const resetForm = () => {
        setEditingId(null);
        setAmount('');
        setDescription('');
        setCategory(categories[0]);
        setType('income');
    };

    const filterRecords = () => {
        return records.filter((record) => {
            const date = parse( record.date, 'yyyy-MM-dd HH:mm', new Date() );

            if (categoryFilter && record.category !== categoryFilter) return false;
            if (timeFilter === 'Today' && !isToday(date)) return false;
            if (timeFilter === 'This Week' && !isThisWeek(date)) return false;

            return true;
        });
    };

    const totalIncome = records.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
    const totalExpense = records.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);
    const balance = totalIncome - totalExpense;

    return (
        <SafeAreaView className="flex-1 bg-white p-5">
            <View className="flex-row items-center justify-between mb-6">
                <TouchableOpacity onPress={() => router.back()} className="p-2">
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <View className="flex-1 items-center -ml-8">
                    <Text className="text-2xl font-bold text-gray-900">💸 Income Tracker</Text>
                    <Text className="text-sm text-gray-500">Manage your records</Text>
                </View>
                <View className="w-[32px]" /> {/* Icon kadar boşluk bırakmak için */}
            </View>

            {/* Summary */}
            <View className="flex-row justify-between mb-4">
                <View className="bg-green-100 px-4 py-2 rounded-xl">
                    <Text className="text-green-700 font-medium">Income</Text>
                    <Text className="text-green-800 font-bold">${totalIncome.toFixed(2)}</Text>
                </View>
                <View className="bg-red-100 px-4 py-2 rounded-xl">
                    <Text className="text-red-700 font-medium">Expense</Text>
                    <Text className="text-red-800 font-bold">${totalExpense.toFixed(2)}</Text>
                </View>
                <View className="bg-blue-100 px-4 py-2 rounded-xl">
                    <Text className="text-blue-700 font-medium">Balance</Text>
                    <Text className="text-blue-800 font-bold">${balance.toFixed(2)}</Text>
                </View>
            </View>

            {/* Type Selector */}
            <View className="flex-row justify-between mb-3">
                <TouchableOpacity className={`flex-1 py-3 mr-2 rounded-xl items-center ${type === 'income' ? 'bg-green-600' : 'bg-gray-200'}`}
                                  onPress={() => setType('income')}>
                    <Text className={`${type === 'income' ? 'text-white' : 'text-black'}`}>Income</Text>
                </TouchableOpacity>
                <TouchableOpacity className={`flex-1 py-3 ml-2 rounded-xl items-center ${type === 'expense' ? 'bg-red-600' : 'bg-gray-200'}`}
                                  onPress={() => setType('expense')}>
                    <Text className={`${type === 'expense' ? 'text-white' : 'text-black'}`}>Expense</Text>
                </TouchableOpacity>
            </View>

            {/* Category Filter */}
            <View className="gap-2 my-2 flex flex-row flex-wrap">
                {categories.map(cat => (
                    <TouchableOpacity key={cat}
                                      className={`px-4 py-2 rounded-full border ${category === cat ? 'bg-black' : 'bg-white'}`}
                                      onPress={() => setCategory(cat)}>
                        <Text className={`${category === cat ? 'text-white' : 'text-gray-800'}`}>{cat}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Time Filter */}
            <View className="gap-2 my-2 flex flex-row flex-wrap">
                {timeFilters.map(tf => (
                    <TouchableOpacity key={tf}
                                      className={`px-3 py-2 rounded-lg border ${timeFilter === tf ? 'bg-black' : 'bg-gray-100'}`}
                                      onPress={() => setTimeFilter(tf)}>
                        <Text className={timeFilter === tf ? 'text-white' : 'text-gray-700'}>{tf}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Form */}
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <TextInput
                    placeholder="Amount"
                    keyboardType="decimal-pad"
                    value={amount}
                    onChangeText={setAmount}
                    className="border border-gray-300 rounded-xl px-4 py-3 mb-3"
                />
                <TextInput
                    placeholder="Description"
                    value={description}
                    onChangeText={setDescription}
                    className="border border-gray-300 rounded-xl px-4 py-3 mb-3"
                />
                <View className="flex-row space-x-2">
                    <TouchableOpacity
                        onPress={saveRecord}
                        className="flex-1 bg-black rounded-xl py-4 mb-4 mx-2 items-center"
                    >
                        <Text className="text-white font-semibold text-base">
                            {editingId ? '✏️ Update Record' : '💾 Save Record'}
                        </Text>
                    </TouchableOpacity>
                    {editingId && (
                        <TouchableOpacity
                            onPress={resetForm}
                            className="bg-gray-300 rounded-xl py-4 mb-4 px-4 mx-2 items-center justify-center"
                        >
                            <Text className="text-black font-semibold text-base">Cancel</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </KeyboardAvoidingView>

            {/* List */}
            <FlatList
                data={filterRecords()}
                keyExtractor={item => item.id.toString()}
                ListEmptyComponent={() => (
                    <Text className="text-gray-400 text-center mt-6">No records match filters.</Text>
                )}
                renderItem={({ item }) => (
                    <View className="flex-row justify-between items-center border border-gray-100 rounded-xl px-4 py-3 mb-2 bg-gray-50">
                        <TouchableOpacity onPress={() => startEdit(item)} className="flex-1">
                            <Text className="font-medium text-gray-800">{item.description}</Text>
                            <Text className="text-xs text-gray-500">{item.date} • {item.category}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => deleteRecord(item.id)}>
                            <Ionicons name="trash" size={20} color="gray" />
                        </TouchableOpacity>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}
