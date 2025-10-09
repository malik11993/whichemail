import Constants from "expo-constants";

export const appwriteConfig = {
    endpoint: Constants.expoConfig?.extra?.APPWRITE_ENDPOINT,
    projectId: Constants.expoConfig?.extra?.APPWRITE_PROJECT_ID,
    databaseId: Constants.expoConfig?.extra?.APPWRITE_DATABASE_ID,
    tableUserId: Constants.expoConfig?.extra?.APPWRITE_TABLE_USER_ID,
    tableServiceId: Constants.expoConfig?.extra?.APPWRITE_TABLE_SERVICE_ID,
};
