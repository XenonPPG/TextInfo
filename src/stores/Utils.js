import {toast} from "vue-sonner";
import {markRaw} from "vue";
import {defineStore} from 'pinia'
import {useTextStyle} from "@/stores/TextStyle.js";
import {useTextProcessor} from "@/stores/TextProcessor.js";

export const useUtils = defineStore('Utils', () => {
    const textProcessor = useTextProcessor();
    const textStyle = useTextStyle();

    function Copy(text) {
        if (text instanceof String || text.length === 0) {
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

    return { Copy };
});