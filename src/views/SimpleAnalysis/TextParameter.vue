<script setup>
import {computed, ref, watch} from 'vue';
import {Icon} from '@iconify/vue';
import {Skeleton} from '@/components/ui/skeleton/index.js';
import {useTextProcessor} from '@/stores/TextProcessor.js';
import {useTextStyle} from '@/stores/TextStyle.js';
import {Button} from '@/components/ui/button/index.js';
import CooldownButton from '@/components/customUI/CooldownButton.vue';
import Separator from '@/components/ui/separator/Separator.vue';
import CopyButton from '@/components/customUI/CopyButton.vue';
import Ghost from '@/components/customUI/Ghost.vue';
import HoverTrigger from '@/components/customUI/HoverTrigger.vue';
import Selectable from '@/components/customUI/Selectable.vue';
import {useUtils} from '@/stores/Utils.js';

const props = defineProps({
  params: Object,
});

const textProcessor = useTextProcessor();
const textStyle = useTextStyle();
const utils = useUtils();

const selected = ref(false);
const unique = ref(false);

const allowUnique = props.params.valueType !== Number;

const filterObj = computed(() => ({
  filter: Array.isArray(props.params.val) ? props.params.val : [props.params.val],
  unique: unique.value
}));

const displayVal = computed(() => {
  const valueType = props.params.valueType;
  const val = props.params.val;

  if (valueType === Number) {
    const postFn = props.params.postFn;
    return postFn ? postFn(val) : val.length;
  } else if (valueType === String) {
    return textStyle.ClampVal(val, 13);
  } else {
    return textStyle.GetFilteredText([filterObj.value]).length;
  }
});

function SetPreview(value) {
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

watch(unique, () => {
  if (selected.value) {
    textStyle.RemoveFilter({filter: props.params.val, unique: !unique.value});
    textStyle.AddFilter(filterObj.value);
  }
});

defineExpose({SetSelection, unique});
</script>

<template>
  <HoverTrigger
      v-if="!textProcessor.loading"
      v-slot="{ isHovering }"
      class="flex flex-1"
      @change="SetPreview"
  >
    <Selectable :selected="selected" :isHovering="isHovering" v-slot="{ style }">
      <button
          @click="() => SetSelection()"
          :class="[
          style,
          'flex flex-1 h-10 border rounded-md hover:cursor-pointer'
        ]"
      >
        <div class="flex flex-1 items-center justify-between">
          <!-- title -->
          <div class="flex">
            <div class="pr-2 ml-2">
              <Icon class="size-6 text-primary" :icon="params.icon" />
            </div>
            <p class="w-0">{{ params.title }}</p>
          </div>

          <!-- toggle unique button -->
          <Ghost v-if="allowUnique" :visible="isHovering || unique" class="pr-1">
            <Button class="size-7" variant="ghost" @click.stop="() => {
              unique = !unique;
              SetPreview(true);
            }">
              <Icon icon="radix-icons:crosshair-1" :class="{ 'text-primary': unique }" />
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
          <div class="size-7" />
          <CooldownButton
              :disable="true"
              variant="link"
              class="text-white p-0 m-0 max-w-0 font-normal"
              @click.stop="utils.Copy(`${props.params.title}: ${displayVal}`)"
          >
            <p v-html="displayVal"></p>
          </CooldownButton>

          <Ghost :visible="isHovering">
            <CopyButton
                v-if="!props.params.postFn"
                :text="textStyle.GetFilteredText([filterObj])"
                class="size-7"
                variant="ghost"
                @click.stop
            />
            <div v-else class="size-7" />
          </Ghost>
        </div>
      </button>
    </Selectable>
  </HoverTrigger>

  <Skeleton
      v-else
      class="rounded-md h-10 transition-colors duration-75 bg-secondary"
  />
</template>
