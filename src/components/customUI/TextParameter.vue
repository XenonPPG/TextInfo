<script setup>
import { computed, ref } from 'vue';
import { Icon } from '@iconify/vue';
import { Skeleton } from '@/components/ui/skeleton';
import { useTextProcessor } from '@/stores/TextProcessor.js';
import { useTextStyle } from '@/stores/TextStyle.js';
import { Button } from '@/components/ui/button';
import Separator from '@/components/ui/separator/Separator.vue';
import CopyButton from '@/components/customUI/CopyButton.vue';
import Ghost from '@/components/customUI/Ghost.vue';

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

const borderStyle = computed(() => selected.value ? 'border-primary' : '');
const borderPreviewStyle = computed(() => selected.value ? '' : 'hover:border-primary hover:border-dashed')
const bgStyle = computed(() => 'bg-' + (selected.value ? 'primary/20' : 'secondary/50'));

const selected = ref(false);
const displayVal = computed(() => Array.isArray(props.val) ? props.val.length : props.val);
const unique = ref(false);

const copyVisible = ref(false);
const copyRef = ref(null);

function SetPreview(value) {
    copyVisible.value = value;
    if (value) {
        textStyle.current = textStyle.Normalize(props.val);
    }
    else {
        textStyle.current = [];
    }
}

function SetSelection(value = null) {
    selected.value = value ?? !selected.value;
    if (selected.value) {
        textStyle.AddFilter(props.val);
    }
    else {
        textStyle.RemoveFilter(props.val);
    }
}
</script>

<template>
    <!-- main block -->
    <button v-if="!textProcessor.loading" @mouseenter="() => SetPreview(true)" @mouseleave="() => SetPreview(false)"
        @click="() => SetSelection()"
        :class="`flex h-10 border ${borderStyle} ${borderPreviewStyle} rounded-md transition-colors duration-150 ${bgStyle} hover:cursor-pointer`">
        <div class="flex flex-1 items-center justify-between">
            <!-- title -->
            <div class="flex">
                <div class="pr-2 ml-2">
                    <Icon class="size-6 text-primary" :icon="icon" />
                </div>
                <p class="w-0">{{ title }}</p>
            </div>
            <!-- toggle unique button -->
            <Ghost :visible="copyVisible || unique" class="pr-1">
                <Button class="size-7" variant="ghost" @click.stop="() => unique = !unique">
                    <Icon v-if="unique" icon="radix-icons:crosshair-1" class="text-primary" />
                    <Icon v-else icon="radix-icons:circle" />
                </Button>
            </Ghost>
        </div>
        <!-- display value -->
        <div
            :class="`flex flex-1 border-l ${borderStyle} items-center justify-between px-1 transition-colors duration-150`">
            <div class="size-7" />
            <!-- copy display value -->
            <Button variant="link" class="text-white p-0 m-0 max-w-0 font-normal"
                @click.stop="copyRef.Copy(displayVal)">
                <p v-html="textStyle.ClampVal(displayVal, 12)"></p>
            </Button>

            <!-- copy value -->
            <Ghost :visible="copyVisible">
                <CopyButton ref="copyRef" :text="textStyle.Normalize(val).join('')" class="size-7" variant="ghost"
                    @click.stop />
            </Ghost>
        </div>
    </button>

    <!-- skeleton -->
    <Skeleton v-else class="rounded-md h-10 transition-colors duration-75 bg-secondary" />
</template>