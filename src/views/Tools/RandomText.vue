<script setup>
import SourceSelect from "@/views/Tools/SourceSelect.vue";
import NumberInput from "@/components/customUI/NumberInput.vue";
import CooldownButton from "@/components/customUI/CooldownButton.vue";
import {useUtils} from "@/stores/Utils.js";
import {ref} from "vue";
import {useTextProcessor} from "@/stores/TextProcessor.js";

const textProcessor = useTextProcessor();

const length = ref(0);
const set = ref([]);
</script>

<template>
  <div class="flex items-center gap-2">
    Выбрать
    <NumberInput v-model="length" class="min-w-30"/>
    из
    <SourceSelect v-model="set"/>
    <CooldownButton icon="radix-icons:check" :disable="true"
                    @click="textProcessor.text = Array.from({length: length}, () => set[Math.floor(Math.random() * set.length)]).join('')"/>
  </div>
</template>