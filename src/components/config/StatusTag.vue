<script setup>
import { defineProps } from 'vue';

defineProps({
    status: String
});

const getStatusSeverity = (status) => {
    switch (status) {
        case 'INSTOCK':
            return 'success';
        case 'LOWSTOCK':
            return 'warning';
        case 'OUTOFSTOCK':
            return 'danger';
        default:
            return 'info';
    }
};
</script>

<template>
    <Tag :value="status" :severity="getStatusSeverity(status)" />
</template>
