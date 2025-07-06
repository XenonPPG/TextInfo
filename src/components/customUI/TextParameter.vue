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
  params: Object,
});

const textProcessor = useTextProcessor();
const textStyle = useTextStyle();

const selected = ref(false);
const unique = ref(false);
const copyRef = ref(null);

const allowUnique = ref(props.params.valueType !== Number);

// возвращает объект с filter и unique
const filterObj = computed(() => ({
  filter: Array.isArray(props.params.val) ? props.params.val : [props.params.val],
  unique: unique.value
}));

const displayVal = computed(() => {
  const valueType = props.params.valueType;
  const val = props.params.val;

  if (valueType === Number) {
    // display number or processed number
    const postFn = props.params.postFn;
    if (postFn) {
      return postFn(val);
    }
    return val.length;
  } else if (valueType === String) {
    // display clamped string
    return textStyle.ClampVal(val, 13);
  } else {
    // display length
    const filtered = textStyle.GetFilteredText(textProcessor.text, [filterObj.value]);
    return filtered.length;
  }
});

function SetPreview(value) {
  // Передаем объект фильтра или null
  textStyle.current = value ? filterObj.value : null;
}

function SetSelection(value = null) {
  if (allowUnique.value) {
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
}

// обновляем фильтр при переключении unique, если активен
watch(unique, () => {
  if (selected.value) {
    textStyle.RemoveFilter({filter: props.params.val, unique: !unique.value});
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
            <Icon class="size-6 text-primary" :icon="params.icon"/>
          </div>
          <p class="w-0">{{ params.title }}</p>
        </div>
        <!-- toggle unique button -->
        <Ghost v-if="allowUnique" :visible="isHovering || unique" class="pr-1">
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
            @click.stop="copyRef.Copy(`${props.params.title}: ${displayVal}`)"
        >
          <p v-html="textStyle.ClampVal(displayVal, 12)"></p>
        </CooldownButton>

        <!-- copy value -->
        <Ghost :visible="isHovering">
          <CopyButton
              ref="copyRef"
              :text="textStyle.Normalize({ filter: params.val, unique: unique }).filter.join('')"
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