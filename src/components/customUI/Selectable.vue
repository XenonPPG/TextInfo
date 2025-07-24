<script setup>
import {computed} from "vue";

const props = defineProps({
  selected: Boolean,
  isHovering: Boolean,
})

const common = 'border transition-colors duration-150'
const selectedStyle = 'bg-primary/20 border-primary'
const normalStyle = 'bg-secondary/50'
const hoverStyle = 'border-primary hover:border-dashed'
const activeHoverStyle = 'hover:border-primary'

const active = computed(() => `${common} ${(props.selected ? selectedStyle : normalStyle)}`)
const hover = computed(() => props.isHovering ? (props.selected ? activeHoverStyle : hoverStyle) : '')
</script>

<template>
  <slot :style="`${active} ${hover}`"/>
</template>