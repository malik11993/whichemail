import {Account, Client, TablesDB} from 'appwrite';
import {appwriteConfig} from "@/utils/expoContants";

export const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);

export const account = new Account(client);
export const tablesDB = new TablesDB(client);

export const appwriteDbConfig = {
    databaseId: appwriteConfig.databaseId,
};