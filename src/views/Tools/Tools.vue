<script setup>
import Category from "@/components/customUI/Category.vue";
import {useTextProcessor} from "@/stores/TextProcessor.js";
import RandomText from "@/views/Tools/RandomText.vue";
const textProcessor = useTextProcessor();

</script>

<template>
  <div class="border rounded-md m-2 p-4">
    <h1 class="text-3xl text-primary">Инструменты</h1>
    <div class="flex flex-col pt-4 gap-5">
      <Category label="Рандом">
        <template #content>
          <RandomText/>
        </template>
      </Category>
    </div>
  </div>
</template>