<script setup>
import {computed, ref, watch} from 'vue';
import {Icon} from '@iconify/vue';
import {Skeleton} from '@/components/ui/skeleton';
import {useTextProcessor} from '@/stores/TextProcessor.js';
import {useTextStyle} from '@/stores/TextStyle.js';
import {Button} from '@/components/ui/button';
import CooldownButton from '@/components/customUI/CooldownButton.vue';
import Separator from '@/components/ui/separator/Separator.vue';
import CopyButton from '@/components/customUI/CopyButton.vue';
import Ghost from '@/components/customUI/Ghost.vue';
import HoverTrigger from '@/components/customUI/HoverTrigger.vue';

const props = defineProps({
  icon: String,
  title: String,
  val: {
    type: [String, Number, Array],
    required: true
  },
});

const textProcessor = useTextProcessor();
const textStyle = useTextStyle();

const selected = ref(false);
const unique = ref(false);
const copyRef = ref(null);

// возвращает объект с filter и unique
const filterObj = computed(() => ({
  filter: Array.isArray(props.val) ? props.val : [props.val],
  unique: unique.value
}));

const displayVal = computed(() => {
  // Передаем массив с одним фильтром
  const filtered = textStyle.GetFilteredText(textProcessor.text, [filterObj.value]);

  // Возвращаем длину для массивов, иначе сам текст
  if (Array.isArray(props.val)) {
    return filtered.length;
  } else {
    return filtered;
  }
});

function SetPreview(value) {
  // Передаем объект фильтра или null
  textStyle.current = value ? filterObj.value : null;
}

function SetSelection(value = null) {
  const newVal = value ?? !selected.value;
  if (newVal !== selected.value) {
    selected.value = newVal;
    if (selected.value) {
      textStyle.AddFilter(filterObj.value);
    } else {
      textStyle.RemoveFilter(filterObj.value);
    }
  }
}

// обновляем фильтр при переключении unique, если активен
watch(unique, () => {
  if (selected.value) {
    textStyle.RemoveFilter({filter: props.val, unique: !unique.value});
    textStyle.AddFilter(filterObj.value);
  }
});

defineExpose({SetSelection, unique});
</script>

<template>
  <!-- main block -->
  <HoverTrigger
      v-if="!textProcessor.loading"
      v-slot="{ isHovering }"
      class="flex flex-1"
      @change="SetPreview"
  >
    <button
        @click="() => SetSelection()"
        :class="[
        'flex flex-1 h-10 border rounded-md transition-colors duration-150 hover:cursor-pointer',
        { 'border-primary': selected, 'hover:border-primary hover:border-dashed': !selected },
        { 'bg-primary/20': selected, 'bg-secondary/50': !selected }
      ]"
    >
      <div class="flex flex-1 items-center justify-between">
        <!-- title -->
        <div class="flex">
          <div class="pr-2 ml-2">
            <Icon class="size-6 text-primary" :icon="icon"/>
          </div>
          <p class="w-0">{{ title }}</p>
        </div>
        <!-- toggle unique button -->
        <Ghost :visible="isHovering || unique" class="pr-1">
          <Button class="size-7" variant="ghost" @click.stop="() => unique = !unique">
            <Icon icon="radix-icons:crosshair-1" :class="{ 'text-primary': unique }"/>
          </Button>
        </Ghost>
      </div>

      <!-- display value -->
      <div
          :class="[
          'flex flex-1 border-l items-center justify-between px-1 transition-colors duration-150',
          { 'border-primary': selected }
        ]"
      >
        <div class="size-7"/>
        <!-- copy display value -->
        <CooldownButton
            :disable="true"
            variant="link"
            class="text-white p-0 m-0 max-w-0 font-normal"
            @click.stop="copyRef.Copy(`${props.title}: ${displayVal}`)"
        >
          <p v-html="textStyle.ClampVal(displayVal, 12)"></p>
        </CooldownButton>

        <!-- copy value -->
        <Ghost :visible="isHovering">
          <CopyButton
              ref="copyRef"
              :text="textStyle.Normalize({ filter: val, unique: unique }).filter.join('')"
              class="size-7"
              variant="ghost"
              @click.stop
          />
        </Ghost>
      </div>
    </button>
  </HoverTrigger>

  <!-- skeleton -->
  <Skeleton
      v-else
      class="rounded-md h-10 transition-colors duration-75 bg-secondary"
  />
</template>