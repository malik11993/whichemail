import {useQuery} from '@tanstack/react-query';
import {account} from '@/services/appwrite/appwrite';
import {showToast} from "@/utils/toast";

// Raw fetcher for current user. Returns null if not authenticated.
export const fetchCurrentUser = async () => {
  try {
    return await account.get();
  } catch (e) {
    // Not logged in or request failed
    console.error(e);
    showToast.error("Error!", "Failed to fetch user");
    return null;
  }
};

// React Query hook to access the current user anywhere in the app
export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });
};

