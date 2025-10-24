import {useMutation, useQueryClient} from '@tanstack/react-query';
import {account, appwriteDbConfig, tablesDB} from '../appwrite/appwrite';
import {ID} from 'appwrite';
import {showToast} from '@/utils/toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {appwriteConfig} from "@/utils/expoContants";




// 🔹 REGISTER
export const useRegister = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({name, email, password}: { name: string; email: string; password: string }) => {
            const user = await account.create({ userId: ID.unique(), email, password, name });

            // 2️⃣ End any active session
            try {
                await account.deleteSession({ sessionId: 'current' });
            } catch {}


            await account.createEmailPasswordSession({ email, password });

            //  Store user info in Appwrite Table for extended profile
            await tablesDB.createRow({
              databaseId: appwriteDbConfig.databaseId,
              tableId: appwriteConfig.tableUserId,
              rowId: ID.unique(),
              data: { name, email, userId: user.$id }
            });

            return user;
        },
        onSuccess: async (data) => {
            showToast.success('Account Created 🎉', `Welcome ${data.name} to WhichEmail!`);
            try { await AsyncStorage.setItem('isAuthenticated', 'true'); } catch {}
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
        onError: (error: any) => {
            console.error('Registration error:', error);
            showToast.error('Registration Failed 😞', error?.message || 'Try again later');
        }
    });
};

// 🔹 LOGIN
export const useLogin = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({email, password}: { email: string; password: string }) => {
            // 2️⃣ End any active session
            try {
                await account.deleteSession({ sessionId: 'current' });
            } catch {}

            await account.createEmailPasswordSession({ email, password });

            const user = await account.get();
            return user;
        },
        onSuccess: async (user) => {
            showToast.success('Welcome back 🎉', user.name || 'You’re logged in');
            try { await AsyncStorage.setItem('isAuthenticated', 'true'); } catch {}
            queryClient.invalidateQueries({ queryKey: ['user'] });
        },
        onError: (error: any) => {
            showToast.error('Login Failed 😞', error?.message || 'Invalid credentials');
        }
    });
};

// 🔹 LOGOUT
export const useLogout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            await account.deleteSession({ sessionId: 'current' });
        },
        onSuccess: async () => {
            showToast.success('Logged Out 👋', 'See you soon!');
            try { await AsyncStorage.removeItem('isAuthenticated'); } catch {}
            queryClient.clear();
        },
        onError: (error: any) => {
            showToast.error('Logout Failed', error?.message || 'Please try again');
        }
    });
};
  