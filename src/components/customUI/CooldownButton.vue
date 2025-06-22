<script setup lang="ts">
import { ref, computed } from 'vue';
import IconButton from '@/components/customUI/IconButton.vue';

const props = withDefaults(
  defineProps<{
    cooldown?: number;
    icon: string;
    cdIcon?: string | null;
  }>(),
  {
    cooldown: 1500,
    cdIcon: null
  }
);


const cooldown = ref(false);
const icon = computed(() => cooldown.value && props.cdIcon !== null ? props.cdIcon : props.icon);
const cursor = computed(() => '!cursor-' + (cooldown.value ? 'auto' : 'pointer'))

function OnClick() {
    cooldown.value = true;
    setTimeout(() => {
        cooldown.value = false;
    }, props.cooldown);
}
</script>

<template>
    <IconButton :icon="icon" @click="OnClick" :class="[cursor, {'pointer-events-none':cooldown}]"/>
</template>