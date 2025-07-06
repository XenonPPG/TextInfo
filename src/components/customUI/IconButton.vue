<script setup>
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/vue';
import { onBeforeMount } from 'vue'
import { loadIcons } from '@iconify/vue'

const props = defineProps({
    icon: String
})

onBeforeMount(() => {
  loadIcons([props.icon])
})
</script>

<template>
    <Button size="icon" variant="outline">
        <Icon class="size-4" :icon="icon" />
    </Button>
</template>