<script setup>
import { ref, markRaw } from 'vue';
import CooldownButton from '@/components/customUI/CooldownButton.vue';
import { Icon } from '@iconify/vue';
import { toast } from 'vue-sonner'
import { useTextStyle } from '@/stores/TextStyle.js';

const props = defineProps({
    text: String
});

const textStyle = useTextStyle();

function Copy(text) {
    if (text instanceof String || text.length == 0) {
        toast.error('Не удалось скопировать',
            {
                description: 'Фильтры не применены',
                action: {
                    label: 'Закрыть',
                    onClick: null,
                },
            })
        return;
    }

    // copy
    navigator.clipboard.writeText(null);
    navigator.clipboard.writeText(text);

    // notify
    toast('Скопировано!', {
        description: markRaw(textStyle.ClampVal(text, 30, true)),
        action: {
            label: 'Закрыть',
            onClick: null,
        },
        class: '!bg-transparent backdrop-blur-md',
        descriptionClass: 'dark:!text-white'
    })
}

defineExpose({ Copy })
</script>

<template>
    <CooldownButton @click="() => Copy(text)" class="size-11" variant="outline" size="icon" icon="radix-icons:copy" cdIcon="lucide:check"/>
</template>