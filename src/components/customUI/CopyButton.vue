<script setup>
import { ref, markRaw } from 'vue';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/vue';
import { toast } from 'vue-sonner'
import { useTextStyle } from '@/stores/TextStyle.js';

const props = defineProps({
    text: String
});

const textStyle = useTextStyle();

const icon = ref('radix-icons:copy');
const cooldown = ref(false);

function Copy() {
    if (props.text instanceof String || props.text.length == 0) {
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
    navigator.clipboard.writeText(props.text);

    // icon change
    cooldown.value = true;
    setTimeout(() => {
        cooldown.value = false;
    }, 1500);

    // notify
    toast('Скопировано!', {
        description: markRaw(textStyle.ClampVal(props.text, 30, true)),
        action: {
            label: 'Закрыть',
            onClick: null,
        },
        class: '!bg-transparent backdrop-blur-md',
        descriptionClass: 'dark:!text-white'
    })
}
</script>

<template>
    <Button :disabled="cooldown" @click="Copy" class="size-11" variant="outline" size="icon">
        <Icon class="size-4" :icon="cooldown ? 'lucide:check' : 'radix-icons:copy'" />
    </Button>
</template>