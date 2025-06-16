<script setup>
import { computed, ref } from 'vue';
import { Icon } from '@iconify/vue';
import { Skeleton } from '@/components/ui/skeleton';
import { useTextProcessor } from '@/stores/TextProcessor.js';
import { useTextStyle } from '@/stores/TextStyle.js';
import Separator from '@/components/ui/separator/Separator.vue';

const props = defineProps({
    icon: String,
    title: String,
    val: {
        type: [String, Number, Array],
        required: true
    }
});

const textProcessor = useTextProcessor();
const textStyle = useTextStyle();

const borderStyle = computed(() => selected.value ? 'border-primary' : 'hover:border-primary hover:border-dashed');
const selected = ref(false);
const displayVal = computed(() => {
    const limit = 12;

    var rVal = Array.isArray(props.val) ? props.val.length : props.val;
    rVal = rVal.toString();
    var exceedsLimit = rVal.length > limit;
    rVal = rVal.slice(0, limit);
    if (exceedsLimit) {
        rVal += '<span class="text-gray-500">...</span>';
    }

    return rVal;
});

function Select() {
    selected.value = !selected.value;
    if (selected.value) {
        textStyle.AddFilter(props.val);
    }
    else {
        textStyle.RemoveFilter(props.val);
    }
}
</script>

<template>
    <button v-if="!textProcessor.loading" @mouseenter="() => textStyle.current = val"
        @mouseleave="textStyle.current = []" @click="Select"
        :class="`flex h-10 border ${borderStyle} rounded-md transition-colors duration-150 bg-secondary/50 hover:cursor-pointer`">
        <div class="flex flex-1 items-center">
            <div class="pr-2 ml-2">
                <Icon class="size-6 text-primary" :icon="icon" />
            </div>
            <p>{{ title }}</p>
        </div>
        <div class="border-l flex-1 items-center justify-center flex">
            <p v-html="displayVal"></p>
        </div>
    </button>
    <Skeleton v-else class="rounded-md h-10 transition-colors duration-75 bg-secondary" />
</template>
