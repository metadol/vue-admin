<script setup>
import { ProductService } from '@/service/ProductService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

import DeleteConfirmationDialog from '@/components/config/DeleteProductDialog.vue';
import ProductDialog from '@/components/config/ProductDialog.vue';
import ProductTable from '@/components/config/ProductTable.vue';
import ToolbarComponent from '@/components/config/ToolbarComponent.vue';

// State Variables
const toast = useToast();
const products = ref([]);
const selectedProducts = ref([]);
const product = ref({});
const productDialog = ref(false); // <-- keep this variable consistent
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const statuses = ref([
    { label: 'INSTOCK', value: 'instock' },
    { label: 'LOWSTOCK', value: 'lowstock' },
    { label: 'OUTOFSTOCK', value: 'outofstock' }
]);

// Fetch Products on Mount
onMounted(() => {
    ProductService.getProducts()
        .then((data) => {
            products.value = data;
        })
        .catch((error) => {
            console.error('Error fetching products:', error);
        });
});

// Methods
const openNew = () => {
    product.value = {};
    productDialog.value = true;
};

const saveProduct = () => {
    if (product.value.name?.trim()) {
        if (product.value.id) {
            // Update existing product
            products.value = products.value.map((p) => (p.id === product.value.id ? { ...product.value } : p));
            toast.add({ severity: 'success', summary: 'Updated', detail: 'Product Updated', life: 3000 });
        } else {
            // Create new product
            product.value.id = createId();
            product.value.image = 'product-placeholder.svg';
            products.value.push({ ...product.value });
            toast.add({ severity: 'success', summary: 'Created', detail: 'Product Created', life: 3000 });
        }
        productDialog.value = false;
        product.value = {};
    }
};

const editProduct = (prod) => {
    product.value = { ...prod };
    productDialog.value = true;
};

const confirmDeleteProduct = (prod) => {
    product.value = prod;
    deleteProductDialog.value = true;
};

const deleteProduct = () => {
    products.value = products.value.filter((p) => p.id !== product.value.id);
    deleteProductDialog.value = false;
    product.value = {};
    toast.add({ severity: 'success', summary: 'Deleted', detail: 'Product Deleted', life: 3000 });
};

const confirmDeleteSelected = () => {
    deleteProductsDialog.value = true;
};

const deleteSelectedProducts = () => {
    products.value = products.value.filter((p) => !selectedProducts.value.includes(p));
    selectedProducts.value = [];
    deleteProductsDialog.value = false;
    toast.add({
        severity: 'success',
        summary: 'Deleted',
        detail: 'Selected Products Deleted',
        life: 3000
    });
};

const exportCSV = () => {
    toast.add({
        severity: 'info',
        summary: 'Export',
        detail: 'Exported to CSV (dummy implementation)',
        life: 3000
    });
};

// Utility Functions
const createId = () => {
    return Math.random().toString(36).substr(2, 5);
};
</script>

<template>
    <div>
        <!-- Toolbar Component -->
        <ToolbarComponent :hasSelection="!!selectedProducts?.length" @create="openNew" @delete-selected="confirmDeleteSelected" @export="exportCSV" />

        <!-- Product Table -->
        <ProductTable :products="products" :filters="filters" :selected="selectedProducts" @edit="editProduct" @delete="confirmDeleteProduct" @update:selected="selectedProducts = $event" />

        <!-- Product Dialog -->
        <ProductDialog :visible="productDialog" :product="product" :statuses="statuses" @update:visible="productDialog = $event" @save="saveProduct" @update:product="product = $event" />

        <!-- Single Product Delete Confirmation Dialog -->
        <DeleteConfirmationDialog v-model:visible="deleteProductDialog" :message="'Are you sure you want to delete ' + product.name + '?'" @confirm="deleteProduct" />

        <!-- Multiple Products Delete Confirmation Dialog -->
        <!-- <DeleteConfirmationDialog v-model:visible="deleteProductsDialog" message="Are you sure you want to delete the selected products?" @confirm="deleteSelectedProducts" /> -->
    </div>
</template>
