<script setup lang="ts">
import {Separator} from '@/components/ui/separator';
import HoverTrigger from '@/components/customUI/HoverTrigger.vue';
import Ghost from '@/components/customUI/Ghost.vue';
import IconButton from "@/components/customUI/IconButton.vue";
import {ref} from "vue";
import {Button} from "@/components/ui/button";
import {Icon} from "@iconify/vue";
import {useMotion} from "@vueuse/motion";

const props = defineProps({
  label: String,
  cols: {type: String, default: 'grid-cols-2'},
})

const open = ref(true);
</script>

<template>
  <HoverTrigger v-slot="{ isHovering }" :id="label">
    <div class="flex gap-4 py-2 items-center">
      <Ghost :visible="isHovering">
        <a class="text-3xl font-bold transition-colors text-gray-700 hover:text-primary" :href="'#' + label">#</a>
      </Ghost>
      <h1 class="text-2xl">{{ label }}</h1>
      <Ghost :visible="isHovering && open" class="flex flex-1 justify-between">
        <div class="flex gap-1">
          <!-- actions slot -->
          <slot name="actions" :isHovering="isHovering"/>
        </div>
      </Ghost>
      <button class="text-4xl" @click="open = !open">
        <Icon icon="radix-icons:chevron-up" :class="['transition-transform duration-300', {'rotate-180':open}]"></Icon>
      </button>
    </div>
    <Separator class="mb-2"/>
    <div :class="['grid gap-2 overflow-hidden', props.cols, {'!h-0':!open}]">
      <!-- content slot -->
      <slot name="content"/>
    </div>
  </HoverTrigger>
</template>