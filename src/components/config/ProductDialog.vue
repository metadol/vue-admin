<script setup>
import { defineEmits, defineProps } from 'vue';

defineProps({
    visible: Boolean,
    product: Object,
    statuses: Array
});

const emit = defineEmits(['save', 'update:visible', 'update:product']);
</script>

<template>
    <!-- Dialog component with v-model:visible -->
    <Dialog :visible="visible" :style="{ width: '450px' }" header="Product Details" :modal="true">
        <div class="flex flex-col gap-6">
            <div>
                <label for="name" class="block font-bold mb-3">Name</label>
                <!-- Use v-model on input to bind product's name -->
                <InputText id="name" v-model="product.name" required="true" autofocus @update:model-value="(value) => emit('update:product', { ...product, name: value })" />
            </div>
            <div>
                <label for="description" class="block font-bold mb-3">Description</label>
                <!-- Use v-model on textarea to bind product's description -->
                <Textarea id="description" v-model="product.description" rows="3" cols="20" @update:model-value="(value) => emit('update:product', { ...product, description: value })" />
            </div>
            <div>
                <label for="inventoryStatus" class="block font-bold mb-3">Inventory Status</label>
                <!-- Use v-model on select to bind product's inventoryStatus -->
                <Select id="inventoryStatus" v-model="product.inventoryStatus" :options="statuses" optionLabel="label" @update:model-value="(value) => emit('update:product', { ...product, inventoryStatus: value })" />
            </div>
        </div>

        <template #footer>
            <!-- Cancel button to emit update:visible event to close dialog -->
            <Button label="Cancel" icon="pi pi-times" text @click="emit('update:visible', false)" />
            <!-- Save button to emit save event -->
            <Button label="Save" icon="pi pi-check" @click="emit('save')" />
        </template>
    </Dialog>
</template>
