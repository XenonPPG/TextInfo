<script setup>
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/vue';

const props = defineProps({
    icon: String
})
</script>

<template>
    <Button size="icon" variant="outline">
        <Icon class="size-4" :icon="icon" />
    </Button>
</template>