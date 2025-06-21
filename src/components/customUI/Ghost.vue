<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    visible: Boolean
})
const className = computed(() => 'opacity-' + (props.visible ? '100' : '0'));
</script>

<template>
    <div :class="`${className} transition-opacity`">
        <slot></slot>
    </div>
</template>