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
import {ref} from "vue";

const sources = (() => {
  const full_ascii = Array.from({length: 128}, (_, i) => String.fromCharCode(i));
  const ascii = full_ascii.slice(32, 127);
  const english = 'abcdefghijklmnopqrstuvwxyz'.slice().split('');
  const english_uppercase = english.map(ch => ch.toUpperCase());
  const numbers = '0123456789'.split('');
  const base64 = `${english_uppercase}${english}${numbers}+/`.split('');
  const base32 = `${numbers}${english_uppercase}`.split('');
  const hex = `${numbers}ABCDEF`.split('');

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

const selected = ref('');

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
  <Select v-model="selected">
    <SelectTrigger class="w-[180px]">
      <SelectValue v-if="selected" class="select-none">{{ selected }}</SelectValue>
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