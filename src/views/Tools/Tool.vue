<script setup>
import HoverTrigger from "@/components/customUI/HoverTrigger.vue";
import IconButton from "@/components/customUI/IconButton.vue";
import {ref} from "vue";

const mode = ref(0);
const modes = ['circle', 'crosshair-1', 'crosshair-2']
</script>

<template>
  <HoverTrigger v-slot="{ isHovering }">
    <div class="flex flex-1 h-15 rounded-md bg-secondary/50 border">
      <div class="flex flex-1 items-center justify-center">
        <slot/>
      </div>
      <div class="flex border-l items-center justify-center gap-2 px-2">
        <IconButton :class="{'!text-gray-500':mode === 0}" :icon="'radix-icons:' + modes[mode]"
                    @click="mode = ++mode % modes.length"/>
        <IconButton icon="radix-icons:check"/>
      </div>
    </div>
  </HoverTrigger>
</template>