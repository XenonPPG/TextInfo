<script setup>
console.time('setup');
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
import {useUtils} from "@/stores/Utils.js";

const props = defineProps({
  params: Object,
});

const textProcessor = useTextProcessor();
const textStyle = useTextStyle();
const utils = useUtils();

const selected = ref(false);
const unique = ref(false);

const allowUnique = props.params.valueType !== Number;

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
    const filtered = textStyle.GetFilteredText([filterObj.value]);
    return filtered.length;
  }
});

function SetPreview(value) {
  // Передаем объект фильтра или null
  if (!props.params.postFn) {
    textStyle.current = value ? filterObj.value : null;
  }
}

function SetSelection(value = null) {
  if (allowUnique) {
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
console.timeEnd('setup');
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
          <Button class="size-7" variant="ghost" @click.stop="() => {
            unique = !unique;
            SetPreview(true);
          }">
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
            @click.stop="utils.Copy(`${props.params.title}: ${displayVal}`)"
        >
          <p v-html="displayVal"></p>
        </CooldownButton>

        <!-- copy value -->
        <Ghost :visible="isHovering">
          <CopyButton
              v-if="!props.params.postFn"
              :text="textStyle.GetFilteredText([filterObj])"
              class="size-7"
              variant="ghost"
              @click.stop
          />
          <div v-else class="size-7"/>
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