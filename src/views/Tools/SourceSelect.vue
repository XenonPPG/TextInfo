<script setup>
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { computed } from 'vue'

const model = defineModel() // v-model из родителя

const sources = (() => {
  const full_ascii = Array.from({length: 128}, (_, i) => String.fromCharCode(i));
  const ascii = full_ascii.slice(32, 127);
  const english = 'abcdefghijklmnopqrstuvwxyz'.split('');
  const english_uppercase = english.map(ch => ch.toUpperCase());
  const numbers = '0123456789'.split('');
  const base64 = `${[...english_uppercase, ...english, ...numbers].join('')}+/`.split('');
  const base32 = `${english_uppercase.join('')}234567`.split('');
  const hex = `${numbers.join('')}ABCDEF`.split('');

  return {
    normal: {
      english: english,
      english_uppercase: english_uppercase,
      numbers: numbers,
    },
    ascii: {
      ascii: ascii,
      full_ascii: full_ascii,
    },
    base: {
      base64: base64,
      base32: base32,
      hex: hex,
    }
  };
})();

// Плоская карта: key -> value (массив)
const flatMap = Object.fromEntries(
    Object.entries(sources).flatMap(([group, content]) =>
        Object.entries(content).map(([key, val]) => [key, val])
    )
)

// Прокси: selectedKey <-> model (value)
const selectedKey = computed({
  get: () => {
    // находим ключ по значению (по ссылке или JSON.stringify — по ситуации)
    const entry = Object.entries(flatMap).find(([_, val]) =>
        JSON.stringify(val) === JSON.stringify(model.value)
    );
    return entry?.[0] ?? '';
  },
  set: (key) => {
    model.value = flatMap[key] ?? []
  }
})

//#region ScrollBar fix
const observer = new MutationObserver(() => {
  if (document.body.style.overflow === 'hidden') {
    document.body.style.setProperty('overflow', 'visible', 'important');
    document.body.style.setProperty('margin-right', '0px', 'important');
    document.body.style.setProperty('padding-right', '0px', 'important');
  }
});
observer.observe(document.body, { attributes: true, attributeFilter: ['style'] });
//#endregion ScrollBar fix
</script>

<template>
  <Select v-model="selectedKey">
    <SelectTrigger class="w-[180px]">
      <SelectValue v-if="selectedKey" class="select-none">{{ selectedKey }}</SelectValue>
      <SelectValue v-else class="select-none">Выберите символы</SelectValue>
    </SelectTrigger>
    <SelectContent>
      <SelectGroup v-for="(content, name, index) in sources" :key="name" :class="[{'border-t mt-2':index !== 0}]">
        <SelectLabel class="text-primary font-normal">{{ name }}</SelectLabel>
        <SelectItem v-for="(value, key) in content" :value="key" :key="key">
          <span class="text-gray-500 w-[3ch] text-end">{{ value.length }}</span> {{ key }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
