import * as SecureStore from 'expo-secure-store';

export const secureStorage = {
    // Save password
    async savePassword(serviceId, password) {
        try {
            await SecureStore.setItemAsync(`pwd_${serviceId}`, password);
            return true;
        } catch (error) {
            console.error('Error saving password:', error);
            return false;
        }
    },

    // Get password
    async getPassword(serviceId) {
        try {
            return await SecureStore.getItemAsync(`pwd_${serviceId}`);
        } catch (error) {
            console.error('Error getting password:', error);
            return null;
        }
    },

    // Delete password
    async deletePassword(serviceId) {
        try {
            await SecureStore.deleteItemAsync(`pwd_${serviceId}`);
            return true;
        } catch (error) {
            console.error('Error deleting password:', error);
            return false;
        }
    },

    // Check if password feature is enabled
    async isPasswordFeatureEnabled() {
        try {
            const enabled = await SecureStore.getItemAsync('password_feature_enabled');
            return enabled === 'true';
        } catch (error) {
            return false;
        }
    },

    // Enable/disable password feature
    async setPasswordFeature(enabled) {
        try {
            await SecureStore.setItemAsync('password_feature_enabled', enabled.toString());
            return true;
        } catch (error) {
            return false;
        }
    },
};