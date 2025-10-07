import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

// Types
export interface Service {
    id: string;
    serviceName: string;
    email: string;
    categoryId: string;
    notes?: string;
    website?: string;
    hasPassword: boolean;
    createdAt: string;
    updatedAt: string;
}

// Mock data (will be replaced with Appwrite later)
const mockServices: Service[] = [
    {
        id: '1',
        serviceName: 'Netflix',
        email: 'john@gmail.com',
        categoryId: '4',
        website: 'netflix.com',
        hasPassword: true,
        notes: 'Family plan subscription',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z',
    },
    {
        id: '2',
        serviceName: 'Amazon',
        email: 'john.doe@yahoo.com',
        categoryId: '2',
        website: 'amazon.com',
        hasPassword: true,
        notes: 'Prime member',
        createdAt: '2024-01-10T08:20:00Z',
        updatedAt: '2024-01-10T08:20:00Z',
    },
    {
        id: '3',
        serviceName: 'LinkedIn',
        email: 'john@gmail.com',
        categoryId: '5',
        website: 'linkedin.com',
        hasPassword: false,
        createdAt: '2024-01-05T14:15:00Z',
        updatedAt: '2024-01-05T14:15:00Z',
    },
    {
        id: '4',
        serviceName: 'Chase Bank',
        email: 'johndoe@outlook.com',
        categoryId: '3',
        website: 'chase.com',
        hasPassword: true,
        notes: 'Main checking account',
        createdAt: '2023-12-20T09:00:00Z',
        updatedAt: '2023-12-20T09:00:00Z',
    },
    {
        id: '5',
        serviceName: 'Instagram',
        email: 'john@gmail.com',
        categoryId: '1',
        website: 'instagram.com',
        hasPassword: true,
        createdAt: '2023-12-15T16:45:00Z',
        updatedAt: '2023-12-15T16:45:00Z',
    },
];

// Simulated API calls
const fetchServices = async (): Promise<Service[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return mockServices;
};

const fetchServiceById = async (id: string): Promise<Service | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockServices.find(service => service.id === id);
};

const searchServices = async (query: string): Promise<Service[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockServices.filter(
        service =>
            service.serviceName.toLowerCase().includes(query.toLowerCase()) ||
            service.email.toLowerCase().includes(query.toLowerCase())
    );
};

// React Query Hooks
export const useServices = () => {
    return useQuery({
        queryKey: ['services'],
        queryFn: fetchServices,
    });
};

export const useService = (id: string) => {
    return useQuery({
        queryKey: ['service', id],
        queryFn: () => fetchServiceById(id),
        enabled: !!id,
    });
};

export const useSearchServices = (query: string) => {
    return useQuery({
        queryKey: ['services', 'search', query],
        queryFn: () => searchServices(query),
        enabled: query.length > 0,
    });
};

// Mutations (will be implemented with Appwrite later)
export const useCreateService = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newService: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            // TODO: Implement Appwrite create
            return {
                ...newService,
                id: Date.now().toString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['services']}).then(r => console.log("Invalidated Queries in serviceQueries"));
        },
    });
};

export const useDeleteService = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            // TODO: Implement Appwrite delete
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['services']});
        },
    });
};