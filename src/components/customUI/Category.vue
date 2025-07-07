<script setup>
import {Separator} from '@/components/ui/separator';
import HoverTrigger from '@/components/customUI/HoverTrigger.vue';
import Ghost from '@/components/customUI/Ghost.vue';

const props = defineProps({
  label: String,
});
</script>

<template>
  <HoverTrigger v-slot="{ isHovering }">
    <div class="flex gap-4 py-2 items-center">
      <h1 class="text-2xl">{{ label }}</h1>
      <Ghost :visible="isHovering" class="flex gap-1">
        <slot name="actions" :isHovering="isHovering" />
      </Ghost>
    </div>
    <Separator class="mb-2"/>
    <div class="grid grid-cols-2 gap-2">
      <slot name="content" />
    </div>
  </HoverTrigger>
</template>