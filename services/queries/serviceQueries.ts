import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {ID, Models, Query, Permission, Role} from "appwrite";
import {appwriteDbConfig, tablesDB} from "@/services/appwrite/appwrite";
import {showToast} from "@/utils/toast";
import {appwriteConfig} from "@/utils/expoContants";
import {useUser} from "@/services/hooks/userQueries";



// ---------- HELPERS ----------
const mapRowToService = (row: Models.Row): Service => ({
    id: row.$id,
    serviceName: (row as any).serviceName ?? "",
    email: (row as any).email ?? "",
    categoryId: (row as any).categoryId ?? "",
    notes: (row as any).notes ?? undefined,
    website: (row as any).website ?? undefined,
    hasPassword: Boolean((row as any).hasPassword),
    createdAt: row.$createdAt,
    updatedAt: row.$updatedAt,
});

// ---------- API CALLS ----------

// Fetch all services for a user
const fetchServices = async (userId?: string): Promise<Service[]> => {
    if (!userId) return [];
    try {
        const res = await tablesDB.listRows({
            databaseId: appwriteDbConfig.databaseId,
            tableId: appwriteConfig.tableServiceId,
            queries: [
                Query.equal("ownerId", userId),
                Query.orderDesc("$createdAt")
            ],
        });
        return res.rows.map(mapRowToService);
    } catch (e: any) {
        console.error("Failed to fetch services:", e);
        showToast.error("Failed to load services", e?.message || "Please try again");
        throw e;
    }
};

// Fetch service by ID
const fetchServiceById = async (id: string): Promise<Service | undefined> => {
    try {
        const row = await tablesDB.getRow({
            databaseId: appwriteDbConfig.databaseId,
            tableId: appwriteConfig.tableServiceId,
            rowId: id,
        });
        return mapRowToService(row);
    } catch (e: any) {
        console.error("Failed to fetch service:", e);
        showToast.error("Failed to load service", e?.message || "Please try again");
        return undefined;
    }
};

// Search services for a user
const searchServices = async (query: string, userId?: string): Promise<Service[]> => {
    if (!query || !userId) return [];
    try {
        const res = await tablesDB.listRows({
            databaseId: appwriteDbConfig.databaseId,
            tableId: appwriteConfig.tableServiceId,
            queries: [
                Query.equal("ownerId", userId),
                Query.or([
                    Query.search("serviceName", query),
                    Query.search("email", query),
                ]),
                Query.orderDesc("$createdAt"),
            ],
        });
        return res.rows.map(mapRowToService);
    } catch (e: any) {
        console.warn("Search failed, falling back to client filtering:", e);
        const all = await fetchServices(userId);
        const q = query.toLowerCase();
        return all.filter(
            (s) =>
                s.serviceName.toLowerCase().includes(q) ||
                s.email.toLowerCase().includes(q)
        );
    }
};

// ---------- REACT QUERY HOOKS ----------

export const useServices = () => {
    const { data: user } = useUser();
    const userId = user?.$id;
    return useQuery({
        queryKey: ["services", userId],
        queryFn: () => fetchServices(userId),
        enabled: !!userId,
    });
};

export const useService = (id: string) => {
    return useQuery({
        queryKey: ["service", id],
        queryFn: () => fetchServiceById(id),
        enabled: !!id,
    });
};

export const useSearchServices = (query: string) => {
    const { data: user } = useUser();
    const userId = user?.$id;
    return useQuery({
        queryKey: ["services", "search", query, userId],
        queryFn: () => searchServices(query, userId),
        enabled: !!userId && query.length > 0,
    });
};

// ---------- MUTATIONS ----------

// Create
export const useCreateService = () => {
    const queryClient = useQueryClient();
    const { data: user } = useUser();

    return useMutation({
        mutationFn: async (
            newService: Omit<Service, "id" | "createdAt" | "updatedAt">
        ) => {
            const userId = user?.$id;
            if (!userId) throw new Error("Not authenticated");
            const now = new Date().toISOString();
            const row = await tablesDB.createRow({
                databaseId: appwriteDbConfig.databaseId,
                tableId: appwriteConfig.tableServiceId,
                rowId: ID.unique(),
                data: {
                    ...newService,
                    ownerId: userId,
                    createdAt: now,
                    updatedAt: now,
                },
                permissions: [
                    Permission.read(Role.user(userId)),
                    Permission.update(Role.user(userId)),
                    Permission.delete(Role.user(userId)),
                    Permission.write(Role.user(userId)),
                ],
            });
            return mapRowToService(row);
        },
        onSuccess: (data) => {
            // include user in cache key to avoid cross-user mix
            queryClient.setQueryData(["services", user?.$id], (old: Service[] | undefined) =>
                old ? [data, ...old] : [data]
            );
            queryClient.invalidateQueries({queryKey: ["services", user?.$id]});
            showToast.success("Service Added", "Your service has been saved");
        },
        onError: (error: any) => {
            showToast.error(
                "Failed to add service",
                error?.message || "Please try again"
            );
        },
    });
};

// Delete
export const useDeleteService = () => {
    const queryClient = useQueryClient();
    const { data: user } = useUser();

    return useMutation({
        mutationFn: async (id: string) => {
            await tablesDB.deleteRow({
                databaseId: appwriteDbConfig.databaseId,
                tableId: appwriteConfig.tableServiceId,
                rowId: id,
            });
            return id;
        },
        onSuccess: (id: string) => {
            queryClient.setQueryData(["services", user?.$id], (old: Service[] | undefined) =>
                (old || []).filter((s) => s.id !== id)
            );
            queryClient.invalidateQueries({queryKey: ["services", user?.$id]});
            showToast.success("Service Deleted");
        },
        onError: (error: any) => {
            showToast.error(
                "Failed to delete service",
                error?.message || "Please try again"
            );
        },
    });
};

// ✅ Update Service Hook
export const useUpdateService = () => {
    const queryClient = useQueryClient();
    const { data: user } = useUser();

    return useMutation({
        // mutationFn accepts one object argument
        mutationFn: async ({id, service}: { id: string; service: Partial<Service> }) => {
            const now = new Date().toISOString();

            const updatedRow = await tablesDB.updateRow({
                databaseId: appwriteDbConfig.databaseId,
                tableId: appwriteConfig.tableServiceId,
                rowId: id,
                data: {
                    ...service,
                    updatedAt: now,
                },
            });

            return mapRowToService(updatedRow);
        },

        onSuccess: (updatedService) => {
            // ✅ Update cache optimistically
            queryClient.setQueryData(['services', user?.$id], (old: Service[] | undefined) =>
                old
                    ? old.map((s) => (s.id === updatedService.id ? updatedService : s))
                    : [updatedService]
            );

            queryClient.invalidateQueries({queryKey: ['services', user?.$id]});

            showToast.success('Service Updated ✅', 'Your service details have been saved');
        },

        onError: (error: any) => {
            showToast.error('Update Failed ❌', error?.message || 'Please try again');
        },
    });
};

