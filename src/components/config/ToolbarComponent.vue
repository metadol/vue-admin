<script setup>
import { defineEmits, defineProps } from 'vue';

defineProps({
    hasSelection: Boolean
});

const emit = defineEmits(['create', 'delete-selected', 'export']);
</script>

<template>
    <div class="toolbar">
        <Button label="New" icon="pi pi-plus" class="mr-2" @click="$emit('create')" />
        <Button label="Delete" icon="pi pi-trash" severity="danger" outlined :disabled="!hasSelection" @click="$emit('delete-selected')" />
        <Button label="Export" icon="pi pi-upload" severity="secondary" class="ml-auto" @click="$emit('export')" />
    </div>
</template>
