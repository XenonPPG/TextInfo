<script setup>
import TextParameter from '@/components/customUI/TextParameter.vue';
import Category from '@/components/customUI/Category.vue';
import {useTextProcessor} from '@/stores/TextProcessor';
import {ref} from "vue";

const textProcessor = useTextProcessor();
const parameterRef = ref(null);
</script>

<template>
  <div class="border rounded-md m-2 p-4">
    <h1 class="text-3xl text-primary">Простой анализ</h1>
    <div class="flex flex-col pt-4 gap-5">
      <Category
          v-for="(textParams, category) in textProcessor.parameters.simple"
          :key="category"
          :label="category"
          :parameters="textParams"
      />

    </div>
  </div>
</template>