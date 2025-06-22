<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    visible: Boolean
})
const className = computed(() => props.visible ? 'opacity-100' : 'opacity-0');
</script>

<template>
    <div :class="`${className} transition-opacity`">
        <slot></slot>
    </div>
</template>