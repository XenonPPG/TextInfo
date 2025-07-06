<script setup>
import CooldownButton from '@/components/customUI/CooldownButton.vue';
import {useUtils} from "@/stores/Utils.js";

const props = defineProps({
  text: String
});

const utils = useUtils();
</script>

<template>
  <CooldownButton @click="() => utils.Copy(text)" class="size-11" variant="outline" size="icon" icon="radix-icons:copy"
                  cdIcon="lucide:check"/>
</template>