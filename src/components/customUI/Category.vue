<script setup>
import { Separator } from '@/components/ui/separator';
import IconButton from '@/components/customUI/IconButton.vue';
import CooldownButton from '@/components/customUI/CooldownButton.vue';
import Ghost from '@/components/customUI/Ghost.vue';
import HoverTrigger from '@/components/customUI/HoverTrigger.vue';

const props = defineProps({
    label: String
})

</script>

<template>
    <HoverTrigger v-slot="{ isHovering }">
        <div class="flex gap-4 py-2 items-center">
            <h1 class="text-2xl">{{ label }}</h1>
            <Ghost :visible="isHovering" class="flex gap-1">
                <CooldownButton icon="lucide:trash" cd-icon="lucide:check" class="size-8" variant="destructive" />
                <IconButton icon="radix-icons:crosshair-1" class="size-8" />
            </Ghost>
        </div>
        <Separator />
        <div ref="gridContainer" class="grid grid-cols-2 gap-2">
            <div class="col-span-2 full-width">
                <slot name="full"></slot>
            </div>
            <slot></slot>
        </div>
    </HoverTrigger>
</template>