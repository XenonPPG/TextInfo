<script setup>
import Key from "@/views/Tools/HotKeys/Key.vue";

const hotkeys = [
  {
    keys: ['Ctrl', 'A'],
    desc: 'Выбрать всё'
  },
  {
    keys: ['Ctrl', 'C'],
    desc: 'Копировать выделенное'
  },
  {
    keys: ['Ctrl', 'V'],
    desc: 'Вставить из буфера'
  },
  {
    keys: ['Ctrl', 'X'],
    desc: 'Вырезать выделенное'
  },
  {
    keys: ['Ctrl', 'Z'],
    desc: 'Отменить действие'
  },
  {
    keys: ['Ctrl', 'Y'],
    desc: 'Повторить отменённое действие'
  },
  {
    keys: ['Ctrl', 'F'],
    desc: 'Поиск по тексту'
  },
  {
    keys: ['Ctrl', 'S'],
    desc: 'Сохранить документ'
  }
].map((item, index) => {
  item.i = index;
  return item;
});

</script>

<template>
  <div v-for="hotkey in hotkeys" :key="hotkey.i"
       class="flex items-center gap-5 transition-colors transition-transform rounded-md hover:bg-gray-800/40 hover:scale-105 hover:translate-x-4">
    <div class="flex gap-1 ml-2">
      <Key v-for="k in hotkey.keys" :keyName="k" :key="k"/>
    </div>
    <p class="text-xl">{{ hotkey.desc }}</p>
  </div>
</template>