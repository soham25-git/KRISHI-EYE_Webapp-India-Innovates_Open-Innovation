import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Secure Storage (For Tokens, Auth, Secrets)
export async function saveSecure(key: string, value: string) {
    try {
        await SecureStore.setItemAsync(key, value);
    } catch (e) {
        console.error(`Error saving secure key ${key}`, e);
    }
}

export async function getSecure(key: string) {
    try {
        return await SecureStore.getItemAsync(key);
    } catch (e) {
        console.error(`Error retrieving secure key ${key}`, e);
        return null;
    }
}

export async function deleteSecure(key: string) {
    try {
        await SecureStore.deleteItemAsync(key);
    } catch (e) {
        console.error(`Error deleting secure key ${key}`, e);
    }
}

// Local Cache (For Offline Sync, Non-sensitive data)
export async function saveCache(key: string, value: any) {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        console.error(`Error saving cache key ${key}`, e);
    }
}

export async function getCache(key: string) {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error(`Error retrieving cache key ${key}`, e);
        return null;
    }
}

export async function deleteCache(key: string) {
    try {
        await AsyncStorage.removeItem(key);
    } catch (e) {
        console.error(`Error deleting cache key ${key}`, e);
    }
}
