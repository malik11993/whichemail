import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {ID, Models, Query} from "appwrite";
import {appwriteDbConfig, tablesDB} from "@/services/appwrite/appwrite";
import {showToast} from "@/utils/toast";

//Get table service id
const TABLE_SERVICE_ID = process.env.EXPO_PUBLIC_APPWRITE_TABLE_SERVICE_ID!;

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

// Fetch all services
const fetchServices = async (): Promise<Service[]> => {
    try {
        const res = await tablesDB.listRows({
            databaseId: appwriteDbConfig.databaseId,
            tableId: TABLE_SERVICE_ID,
            queries: [Query.orderDesc("$createdAt")],
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
            tableId: TABLE_SERVICE_ID,
            rowId: id,
        });
        return mapRowToService(row);
    } catch (e: any) {
        console.error("Failed to fetch service:", e);
        showToast.error("Failed to load service", e?.message || "Please try again");
        return undefined;
    }
};

// Search services
const searchServices = async (query: string): Promise<Service[]> => {
    if (!query) return [];
    try {
        const res = await tablesDB.listRows({
            databaseId: appwriteDbConfig.databaseId,
            tableId: TABLE_SERVICE_ID,
            queries: [
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
        const all = await fetchServices();
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
    return useQuery({
        queryKey: ["services"],
        queryFn: fetchServices,
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
    return useQuery({
        queryKey: ["services", "search", query],
        queryFn: () => searchServices(query),
        enabled: query.length > 0,
    });
};

// ---------- MUTATIONS ----------

// Create
export const useCreateService = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (
            newService: Omit<Service, "id" | "createdAt" | "updatedAt">
        ) => {
            const now = new Date().toISOString();
            const row = await tablesDB.createRow({
                databaseId: appwriteDbConfig.databaseId,
                tableId: TABLE_SERVICE_ID,
                rowId: ID.unique(),
                data: {
                    ...newService,
                    createdAt: now,
                    updatedAt: now,
                },
            });
            return mapRowToService(row);
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["services"], (old: Service[] | undefined) =>
                old ? [data, ...old] : [data]
            );
            queryClient.invalidateQueries({queryKey: ["services"]});
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

    return useMutation({
        mutationFn: async (id: string) => {
            await tablesDB.deleteRow({
                databaseId: appwriteDbConfig.databaseId,
                tableId: TABLE_SERVICE_ID,
                rowId: id,
            });
            return id;
        },
        onSuccess: (id: string) => {
            queryClient.setQueryData(["services"], (old: Service[] | undefined) =>
                (old || []).filter((s) => s.id !== id)
            );
            queryClient.invalidateQueries({queryKey: ["services"]});
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

    return useMutation({
        // mutationFn accepts one object argument
        mutationFn: async ({id, service}: { id: string; service: Partial<Service> }) => {
            const now = new Date().toISOString();

            const updatedRow = await tablesDB.updateRow({
                databaseId: appwriteDbConfig.databaseId,
                tableId: TABLE_SERVICE_ID,
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
            queryClient.setQueryData(['services'], (old: Service[] | undefined) =>
                old
                    ? old.map((s) => (s.id === updatedService.id ? updatedService : s))
                    : [updatedService]
            );

            queryClient.invalidateQueries({queryKey: ['services']});

            showToast.success('Service Updated ✅', 'Your service details have been saved');
        },

        onError: (error: any) => {
            showToast.error('Update Failed ❌', error?.message || 'Please try again');
        },
    });
};

