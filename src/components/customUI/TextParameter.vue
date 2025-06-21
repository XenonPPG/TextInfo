<script setup>
import { computed, ref } from 'vue';
import { Icon } from '@iconify/vue';
import { Skeleton } from '@/components/ui/skeleton';
import { useTextProcessor } from '@/stores/TextProcessor.js';
import { useTextStyle } from '@/stores/TextStyle.js';
import Separator from '@/components/ui/separator/Separator.vue';
import CopyButton from '@/components/customUI/CopyButton.vue';
import Ghost from '@/components/customUI/Ghost.vue';

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
const displayVal = computed(() => Array.isArray(props.val) ? props.val.length : props.val);
const copyVisible = ref(false);

function Preview(enable) {
    copyVisible.value = enable;
    if (enable) {
        textStyle.current = textStyle.Normalize(props.val);
    }
    else {
        textStyle.current = [];
    }
}

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
    <button v-if="!textProcessor.loading" @mouseenter="() => Preview(true)" @mouseleave="() => Preview(false)"
        @click="Select"
        :class="`flex h-10 border ${borderStyle} rounded-md transition-colors duration-150 bg-secondary/50 hover:cursor-pointer`">
        <div class="flex flex-1 items-center">
            <div class="pr-2 ml-2">
                <Icon class="size-6 text-primary" :icon="icon" />
            </div>
            <p>{{ title }}</p>
        </div>
        <div class="border-l flex-1 items-center justify-between flex px-1">
            <div />
            <p v-html="textStyle.ClampVal(displayVal, 12)"></p>
            <Ghost :visible="copyVisible">
                <CopyButton :text="displayVal" class="size-7" variant="ghost" @click.stop/>
            </Ghost>
        </div>
    </button>
    <Skeleton v-else class="rounded-md h-10 transition-colors duration-75 bg-secondary" />
</template>