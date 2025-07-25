import {defineStore} from 'pinia'
import {reactive} from "vue";

export const useSettings = defineStore('Settings', () => {
    const settings = reactive({
        general: {
            animations: {
                value: true
            }
        },
        analysis: {
            sort_unique: {
                value: false
            },
            copy_with_name: {
                value: false
            }
        }
    })
    return {settings};
});