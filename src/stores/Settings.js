import {defineStore} from 'pinia'
import {reactive} from "vue";

export const useSettings = defineStore('Settings', () => {
    const settings = reactive({
        analysis: {
            sort_unique: {
                value: false
            },
        },
    })
    return {settings};
});