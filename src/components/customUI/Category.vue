<script setup>
import { ref } from 'vue';
import { Separator } from '@/components/ui/separator';
import IconButton from '@/components/customUI/IconButton.vue';
import CooldownButton from '@/components/customUI/CooldownButton.vue';
import Ghost from '@/components/customUI/Ghost.vue';
import HoverTrigger from '@/components/customUI/HoverTrigger.vue';
import TextParameter from '@/components/customUI/TextParameter.vue';

const props = defineProps({
  label: String,
  parameters: Object,
});

const parameterRefs = ref([]);

const handleDeselect = () => {
  parameterRefs.value.forEach(p => p?.SetSelection(false));
};

const handleToggleUnique = () => {
  const anyUnique = parameterRefs.value.some(p => p?.unique);
  parameterRefs.value.forEach(p => p.unique = !anyUnique);
};
</script>

<template>
  <HoverTrigger v-slot="{ isHovering }">
    <div class="flex gap-4 py-2 items-center">
      <h1 class="text-2xl">{{ label }}</h1>
      <Ghost :visible="isHovering" class="flex gap-1">
        <CooldownButton @click="handleDeselect" icon="lucide:trash" cd-icon="lucide:check" class="size-8" variant="destructive" />
        <IconButton @click="handleToggleUnique" icon="radix-icons:crosshair-1" class="size-8" />
      </Ghost>
    </div>
    <Separator class="mb-2"/>
    <div class="grid grid-cols-2 gap-2">
      <TextParameter
          v-for="(params, title) in parameters"
          :key="title"
          :title="title"
          :icon="params.icon"
          :val="params.val || 0"
          :unique="false"
          ref="parameterRefs"
      />
    </div>
  </HoverTrigger>
</template>
