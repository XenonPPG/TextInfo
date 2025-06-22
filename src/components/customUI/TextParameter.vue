<script setup>
import { computed, ref } from 'vue';
import { Icon } from '@iconify/vue';
import { Skeleton } from '@/components/ui/skeleton';
import { useTextProcessor } from '@/stores/TextProcessor.js';
import { useTextStyle } from '@/stores/TextStyle.js';
import { Button } from '@/components/ui/button';
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

const borderStyle = computed(() => selected.value ? 'border-primary' : '');
const borderPreviewStyle = computed(() => selected.value ? '' : 'hover:border-primary hover:border-dashed')
const bgStyle = computed(() => selected.value ? 'bg-primary/20' : 'bg-secondary/50');

const selected = ref(false);
const displayVal = computed(() => Array.isArray(props.val) ? props.val.length : props.val);
const unique = ref(false);

const copyRef = ref(null);

function SetPreview(value) {
    textStyle.current = value ? textStyle.Normalize(props.val) : [];
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
    <HoverTrigger v-if="!textProcessor.loading" v-slot="{ isHovering }" class="flex flex-1" @change="SetPreview">
        <button @click="() => SetSelection()"
            :class="`flex flex-1 h-10 border ${borderStyle} ${borderPreviewStyle} rounded-md transition-colors duration-150 ${bgStyle} hover:cursor-pointer`">
            <div class="flex flex-1 items-center justify-between">
                <!-- title -->
                <div class="flex">
                    <div class="pr-2 ml-2">
                        <Icon class="size-6 text-primary" :icon="icon" />
                    </div>
                    <p class="w-0">{{ title }}</p>
                </div>
                <!-- toggle unique button -->
                <Ghost :visible="isHovering || unique" class="pr-1">
                    <Button class="size-7" variant="ghost" @click.stop="() => unique = !unique">
                        <Icon icon="radix-icons:crosshair-1" :class="{ 'text-primary': unique }" />
                    </Button>
                </Ghost>
            </div>
            <!-- display value -->
            <div
                :class="`flex flex-1 border-l ${borderStyle} items-center justify-between px-1 transition-colors duration-150`">
                <div class="size-7" />
                <!-- copy display value -->
                <CooldownButton :disable="true" variant="link" class="text-white p-0 m-0 max-w-0 font-normal"
                    @click.stop="copyRef.Copy(displayVal)">
                    <p v-html="textStyle.ClampVal(displayVal, 12)"></p>
                </CooldownButton>

                <!-- copy value -->
                <Ghost :visible="isHovering">
                    <CopyButton ref="copyRef" :text="textStyle.Normalize(val).join('')" class="size-7" variant="ghost"
                        @click.stop />
                </Ghost>
            </div>
        </button>
    </HoverTrigger>

    <!-- skeleton -->
    <Skeleton v-else class="rounded-md h-10 transition-colors duration-75 bg-secondary" />
</template>