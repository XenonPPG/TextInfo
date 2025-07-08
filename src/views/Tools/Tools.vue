<script setup>
import {useSettings} from "@/stores/Settings.js";
import Category from "@/components/customUI/Category.vue";
import {Switch} from "@/components/ui/switch/index.js";
import NumberInput from "@/components/customUI/NumberInput.vue";
import {useTextProcessor} from "@/stores/TextProcessor.js";
import {computed} from "vue";
import SourceSelect from "@/views/Tools/SourceSelect.vue";

const settings = useSettings();
const text = computed(() => useTextProcessor().text);
const tools = {
  generate_text: {
    random_text: {
      fn: () => {
        const ascii = Array.from({ length: 95 }, (_, i) => String.fromCharCode(i + 32));
        return Array.from({length: 10}, () => ascii[Math.floor(Math.random() * ascii.length)]).join("");
      },
      icon: 'radix-icons:crumpled-paper'
    }
  }
};
</script>

<template>
  <div class="border rounded-md m-2 p-4">
    <h1 class="text-3xl text-primary">Инструменты</h1>
    <div class="flex flex-col pt-4 gap-5">
      <SourceSelect/>
      <!--      <Category v-for="(setting, category) in settings.settings" :label="category">-->
      <!--        <template #content>-->
      <!--          <div v-for="(params, name) in setting" class="flex items-center gap-2">-->
      <!--            <Switch v-if="typeof params.value === 'boolean'" :id="category + name"/>-->
      <!--            <NumberInput v-else-if="typeof params.value === 'number'" :id="category + name"/>-->
      <!--            <label class="h-7 select-none" :for="category + name">{{ name }}</label>-->
      <!--          </div>-->
      <!--        </template>-->
      <!--      </Category>-->
    </div>
  </div>
</template>