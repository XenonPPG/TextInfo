<script setup>
import TextParameter from '@/components/customUI/TextParameter.vue';
import Category from '@/components/customUI/Category.vue';
import CooldownButton from '@/components/customUI/CooldownButton.vue';
import IconButton from '@/components/customUI/IconButton.vue';
import {useTextProcessor} from '@/stores/TextProcessor.js';
import {ref} from "vue";

const textProcessor = useTextProcessor();
const parameterRefs = ref({});

const handleDeselect = (category) => {
  const refs = parameterRefs.value[category] || [];
  refs.forEach(p => p?.SetSelection(false));
};

const handleToggleUnique = (category) => {
  const refs = parameterRefs.value[category] || [];
  const anyUnique = refs.some(p => p?.unique);
  refs.forEach(p => p.unique = !anyUnique);
};
</script>

<template>
  <div class="border rounded-md m-2 p-4">
    <h1 class="text-3xl text-primary">Простой анализ</h1>
    <div class="flex flex-col pt-4 gap-5">
      <Category
          v-for="(textParams, category) in textProcessor.parameters.simple"
          :key="category"
          :label="category"
      >
        <template #actions>
          <CooldownButton
              @click="handleDeselect(category)"
              icon="lucide:trash"
              cd-icon="lucide:check"
              class="size-8"
              variant="destructive"
          />
          <IconButton
              @click="handleToggleUnique(category)"
              icon="radix-icons:crosshair-1"
              class="size-8"
          />
        </template>

        <template #content>
          <TextParameter
              v-for="(params, title) in textParams"
              :key="title"
              :params="{ title: title, ...params}"
              :ref="el => {
                if (!parameterRefs[category]) parameterRefs[category] = [];
                if (el) parameterRefs[category].push(el);
              }"
          />
        </template>
      </Category>
    </div>
  </div>
</template>