<script setup>
import { useCreateConfig, useDeleteConfig, useFetchConfig, useUpdateConfig } from '@/api/config-queries';
import { ProductService } from '@/service/ProductService';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref, toRaw } from 'vue';

onMounted(() => {
    ProductService.getProducts()
        .then((data) => {
            products.value = data;
            console.log(products.value); // Ensure the log is inside the .then block
            console.log(toRaw(products.value));
        })
        .catch((error) => {
            console.error('Error fetching products:', error);
        });
});

const toast = useToast();
const dt = ref();
const products = ref();
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const product = ref({});
const selectedProducts = ref();
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const submitted = ref(false);
const statuses = ref([
    { label: 'INSTOCK', value: 'instock' },
    { label: 'LOWSTOCK', value: 'lowstock' },
    { label: 'OUTOFSTOCK', value: 'outofstock' }
]);

//Tanstack queries
const { data: configData } = useFetchConfig();
// Get mutations with their loading states
const {
    mutateAsync: createConfigMutate,
    isPending: isCreatePending // Note: changed from isLoading to isPending
} = useCreateConfig();

const {
    mutateAsync: updateConfigMutate,
    isPending: isUpdatePending // Note: changed from isLoading to isPending
} = useUpdateConfig();

// Combine loading states using computed
const isLoading = computed(() => isCreatePending.value || isUpdatePending.value);

const { mutate: deleteConfigMutate } = useDeleteConfig();

const formatCurrency = (value) => {
    if (value) return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    return;
};
const openNew = () => {
    product.value = {};
    submitted.value = false;
    productDialog.value = true;
};
const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
};
const saveProduct = async () => {
    submitted.value = true;

    // Early return if no key or empty key
    if (!product.value?.key?.trim()) {
        return;
    }

    try {
        if (product.value._id) {
            await updateConfigMutate({
                id: product.value._id,
                data: product.value
            });
            toast.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Product Updated',
                life: 3000
            });
        } else {
            await createConfigMutate(product.value);
            toast.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Product Created',
                life: 3000
            });
        }

        // Close dialog and reset form only after successful operation
        productDialog.value = false;
        product.value = {};
    } catch (error) {
        console.error('Error saving product:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to save product',
            life: 3000
        });
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
    deleteConfigMutate(
        product.value._id, // Just pass the ID directly
        {
            onSuccess: () => {
                // alert('Config(s) deleted successfully!');
            },
            onError: (error) => {
                console.error('Error deleting config(s):', error);
                // alert('Failed to delete config(s). Please try again.');
            }
        }
    );

    products.value = products.value.filter((val) => val.id !== product.value.id);
    deleteProductDialog.value = false;
    product.value = {};
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
};
const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < products.value.length; i++) {
        if (products.value[i].id === id) {
            index = i;
            break;
        }
    }

    return index;
};
const createId = () => {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
};
const exportCSV = () => {
    dt.value.exportCSV();
};
const confirmDeleteSelected = () => {
    deleteProductsDialog.value = true;
};
const deleteSelectedProducts = () => {
    products.value = products.value.filter((val) => !selectedProducts.value.includes(val));

    deleteConfigMutate(
        selectedProducts.value.map((product) => product._id), // Just pass the ID directly
        {
            onSuccess: () => {
                // alert('Config(s) deleted successfully!');
            },
            onError: (error) => {
                console.error('Error deleting config(s):', error);
                // alert('Failed to delete config(s). Please try again.');
            }
        }
    );
    deleteProductsDialog.value = false;
    selectedProducts.value = null;
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
};

const getStatusLabel = (status) => {
    switch (status) {
        case 'INSTOCK':
            return 'success';

        case 'LOWSTOCK':
            return 'warn';

        case 'OUTOFSTOCK':
            return 'danger';

        default:
            return null;
    }
};
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-6">
                <template #start>
                    <Button label="New" icon="pi pi-plus" class="mr-2" @click="openNew" />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" outlined @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" />
                </template>

                <template #end>
                    <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" customUpload chooseLabel="Import" class="mr-2" auto :chooseButtonProps="{ severity: 'secondary' }" />
                    <Button label="Export" icon="pi pi-upload" severity="secondary" @click="exportCSV($event)" />
                </template>
            </Toolbar>

            <DataTable
                ref="dt"
                v-model:selection="selectedProducts"
                :value="configData"
                dataKey="_id"
                :paginator="true"
                :rows="10"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
            >
                <template #header>
                    <div class="flex flex-wrap items-center justify-between gap-2">
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
                <Column field="key" header="Key" sortable style="min-width: 12rem"></Column>
                <Column field="value" header="Value" sortable style="max-width: 12rem" :bodyStyle="{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }" />
                <Column field="description" header="Description" sortable style="min-width: 16rem"></Column>

                <!-- <Column field="inventoryStatus" header="Status" sortable style="min-width: 12rem">
                    <template #body="slotProps">
                        <Tag :value="slotProps.data.inventoryStatus" :severity="getStatusLabel(slotProps.data.inventoryStatus)" />
                    </template>
                </Column> -->
                <Column :exportable="false" style="min-width: 12rem">
                    <template #body="slotProps">
                        <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editProduct(slotProps.data)" />
                        <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteProduct(slotProps.data)" />
                    </template>
                </Column>
            </DataTable>
        </div>

        <Dialog v-model:visible="productDialog" :style="{ width: '450px' }" header="Product Details" :modal="true">
            <div class="flex flex-col gap-6">
                <img v-if="product.image" :src="`https://primefaces.org/cdn/primevue/images/product/${product.image}`" :alt="product.image" class="block pb-4 m-auto" />
                <div>
                    <label for="key" class="block mb-3 font-bold">Name</label>
                    <InputText id="key" v-model.trim="product.key" required="true" autofocus :invalid="submitted && !product.key" fluid />
                    <small v-if="submitted && !product.key" class="text-red-500">Name is required.</small>
                </div>
                <div>
                    <label for="value" class="block mb-3 font-bold">Value</label>
                    <Textarea id="value" v-model="product.value" required="true" rows="2" cols="20" fluid />
                </div>
                <div>
                    <label for="description" class="block mb-3 font-bold">Description</label>
                    <Textarea id="description" v-model="product.description" required="true" rows="3" cols="20" fluid />
                </div>
                <!-- <div>
                    <label for="inventoryStatus" class="block mb-3 font-bold">Inventory Status</label>
                    <Select id="inventoryStatus" v-model="product.inventoryStatus" :options="statuses" optionLabel="label" placeholder="Select a Status" fluid></Select>
                </div> -->
            </div>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" text @click="hideDialog" />
                <Button :label="isLoading ? 'Saving...' : 'Save'" :icon="isLoading ? 'pi pi-spinner' : 'pi pi-check'" :loading="isLoading" :disabled="isLoading" @click="saveProduct" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="product"
                    >Are you sure you want to delete <b>{{ product.key }}</b
                    >?</span
                >
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />
                <Button label="Yes" icon="pi pi-check" @click="deleteProduct" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
            <div class="flex items-center gap-4">
                <i class="pi pi-exclamation-triangle !text-3xl" />
                <span v-if="product">Are you sure you want to delete the selected products?</span>
            </div>
            <template #footer>
                <Button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false" />
                <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" />
            </template>
        </Dialog>
    </div>
</template>
