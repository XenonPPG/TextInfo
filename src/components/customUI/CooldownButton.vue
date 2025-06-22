<script setup lang="ts">
import { ref, computed } from 'vue';
import { Button } from '@/components/ui/button';
import IconButton from '@/components/customUI/IconButton.vue';

const props = withDefaults(
  defineProps<{
    cooldown?: number;
    icon?: string | null;
    cdIcon?: string | null;
    disable?: boolean | null;
  }>(),
  {
    cooldown: 1000,
    cdIcon: null
  }
);


const cd = ref(false);
const icon = computed(() => cd.value && props.cdIcon !== null ? props.cdIcon : props.icon);
const cursor = computed(() => '!cursor-' + (cd.value ? 'auto' : 'pointer'))

function OnClick() {
  cd.value = true;
  setTimeout(() => {
    cd.value = false;
  }, props.cooldown);
}
</script>

<template>
  <IconButton v-if="icon" :icon="icon" :disabled="cd && disable" @click="OnClick"
    :class="[cursor, { 'pointer-events-none': cd }]" />
  <Button v-else :disabled="cd && disable" @click="OnClick" :class="[cursor, { 'pointer-events-none': cd }]">
    <slot></slot>
  </Button>
</template>