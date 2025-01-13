<script setup>
import { defineEmits, defineProps } from 'vue';
import StatusTag from './StatusTag.vue';

defineProps({
    products: Array,
    filters: Object,
    selected: Array
});

const emit = defineEmits(['edit', 'delete', 'update:selected']);
</script>

<template>
    <DataTable
        ref="dt"
        :selection="selected"
        :value="products"
        dataKey="id"
        :paginator="true"
        :rows="10"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        @update:selected="(val) => emit('update:selected', val)"
    >
        <template #header>
            <div class="flex flex-wrap gap-2 items-center justify-between">
                <h4 class="m-0">Manage Products</h4>
                <IconField>
                    <InputIcon>
                        <i class="pi pi-search" />
                    </InputIcon>
                    <InputText v-model="filters['global'].value" placeholder="Search..." />
                </IconField>
            </div>
        </template>

        <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
        <Column field="code" header="Key" sortable style="min-width: 12rem"></Column>
        <Column field="name" header="Value" sortable style="min-width: 16rem"></Column>

        <Column field="inventoryStatus" header="Status" sortable style="min-width: 12rem">
            <template #body="slotProps">
                <StatusTag :status="slotProps.data.inventoryStatus" />
            </template>
        </Column>
        <Column :exportable="false" style="min-width: 12rem">
            <template #body="slotProps">
                <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="$emit('edit', slotProps.data)" />
                <Button icon="pi pi-trash" outlined rounded severity="danger" @click="$emit('delete', slotProps.data)" />
            </template>
        </Column>
    </DataTable>
</template>
