<script setup>
import { defineEmits, defineProps } from 'vue';

defineProps({
    visible: Boolean,
    message: String
});

const emit = defineEmits(['confirm', 'update:visible']);
</script>

<template>
    <!-- Bind 'visible' prop using v-bind and emit 'update:visible' on update -->
    <Dialog :visible="visible" :style="{ width: '450px' }" header="Confirm" :modal="true" @update:visible="$emit('update:visible', $event)">
        <div class="flex items-center gap-4">
            <i class="pi pi-exclamation-triangle !text-3xl" />
            <span>{{ message }}</span>
        </div>
        <template #footer>
            <Button label="No" icon="pi pi-times" text @click="$emit('update:visible', false)" />
            <Button label="Yes" icon="pi pi-check" text @click="$emit('confirm')" />
        </template>
    </Dialog>
</template>
