import Constants from "expo-constants";

/*
* App credentials config
 */
export const appwriteConfig = {
    endpoint: Constants.expoConfig?.extra?.APPWRITE_ENDPOINT,
    projectId: Constants.expoConfig?.extra?.APPWRITE_PROJECT_ID,
    databaseId: Constants.expoConfig?.extra?.APPWRITE_DATABASE_ID,
    tableUserId: Constants.expoConfig?.extra?.APPWRITE_TABLE_USER_ID,
    tableServiceId: Constants.expoConfig?.extra?.APPWRITE_TABLE_SERVICE_ID,
};

/*
* Gemini credentials config
 */
export const geminiConfig = {
    GEMINI_API_KEY: Constants.expoConfig?.extra?.GEMINI_API_KEY,
    GEMINI_API_URL: Constants.expoConfig?.extra?.GEMINI_API_URL,
}
