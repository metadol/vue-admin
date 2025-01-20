import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { createConfig, deleteConfig, fetchConfig, updateConfig } from './config';

// Fetch Config Query
export const useFetchConfig = () => {
    return useQuery({
        queryKey: ['config'],
        queryFn: fetchConfig
    });
};

// Create Config Mutation
export const useCreateConfig = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createConfig,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['config'] });
        }
    });
};

// Update Config Mutation
export const useUpdateConfig = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateConfig(id, data), // Destructure id and data here
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['config'] });
        },
    });
};


// Delete Config Mutation
export const useDeleteConfig = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteConfig,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['config'] });
        }
    });
};