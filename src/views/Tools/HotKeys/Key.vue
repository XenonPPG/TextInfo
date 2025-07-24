<script setup>
const props = defineProps({
  keyName: String
})

const baseClass = "px-2 text-xl font-semibold rounded-md border-gray-700"
</script>

<template>
  <div class="py-3">
    <div class="relative inline-block">
      <!-- Нижний контейнер (эффект "тени") -->
      <p :class="['absolute left-0 bg-gray-700 text-transparent border-3', baseClass, 'z-0']">
        {{ props.keyName }}
      </p>
      <!-- Верхний основной контейнер -->
      <p :class="['relative -mt-[5px] bg-gray-800 border-l-3 border-t-3 border-r-3', baseClass, 'z-10']">
        {{ props.keyName }}
      </p>
    </div>
  </div>
</template>
