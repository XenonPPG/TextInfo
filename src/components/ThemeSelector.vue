<script setup>
import { ref, computed } from 'vue';
import { Icon } from '@iconify/vue';
import { Button } from '@/components/ui/button';
import { useColorMode } from '@vueuse/core';

const open = ref(false);

const colorMode = useColorMode();
const selectedMode = ref(colorMode.value);
const icons = [
    {
        mode: 'dark',
        icon: 'moon'
    },
    {
        mode: 'light',
        icon: 'sun'
    },
    {
        mode: 'auto',
        icon: 'half-2'
    }
]

function GetIcon(name) {
    return `radix-icons:${icons.find(i => i.mode === name).icon}`;
}

function SetMode(mode) {
    selectedMode.value = mode;
    colorMode.value = mode;
}

</script>

<template>
    <div class="flex flex-col relative gap-2 items-end">
        <Button @click="open = !open" class="size-11" variant="outline" size="icon">
            <Icon class="size-4" :icon="GetIcon(selectedMode)"/>
        </Button>
        <div v-if="open" class="flex flex-col border rounded-md p-2 gap-2 absolute top-12 backdrop-blur-md">
            <Button class="h-11 w-22" v-for="mode in icons" :key="mode.mode"
                :variant="mode.mode !== selectedMode ? 'outline' : ''" @click="SetMode(mode.mode)">
                <Icon class="size-4" :icon="GetIcon(mode.mode)" />
                <p>{{ mode.mode }}</p>
            </Button>
        </div>
    </div>
</template>