<script setup>
import { ref } from 'vue';

const hover = ref(false);

const emit = defineEmits(['start', 'end', 'change']);

function OnHover(isHovering) {
    hover.value = isHovering;
    emit('change', isHovering);
    emit(isHovering ? 'start' : 'end');
}
</script>

<template>
    <div @mouseenter="() => OnHover(true)" @mouseleave="() => OnHover(false)">
        <slot :isHovering="hover"></slot>
    </div>
</template>