<script setup>
import { Separator } from '@/components/ui/separator';

const props = defineProps({
    label: String
})
</script>

<template>
    <div>
        <h1 class="text-2xl">{{ label }}</h1>
        <Separator />
        <div ref="gridContainer" class="grid grid-cols-2 gap-2">
            <div class="col-span-2 full-width">
                <slot name="full"></slot>
            </div>
            <slot></slot>
        </div>
    </div>
</template>