<script setup>
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@iconify/vue';
import { useTextProcessor } from '@/stores/TextProcessor.js';
import { useTextStyle } from '@/stores/TextStyle.js'
import ThemeSelector from '@/components/ThemeSelector.vue';
import Textarea from '@/components/ui/textarea/Textarea.vue';
import SimpleAnalysis from '@/components/SimpleAnalysis.vue';
import TextareaHighlighted from '@/components/customUI/TextareaHighlighted.vue';
import CopyButton from '@/components/customUI/CopyButton.vue';
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css' // vue-sonner v2 requires this import

const textProcessor = useTextProcessor();
const textStyle = useTextStyle();

</script>

<template>
    <header class="w-full z-5 flex fixed top-0 justify-between items-center border-b border-dashed p-5 backdrop-blur-3xl">
        <h1 class="text-6xl">TextInfo <span class="text-4xl text-primary">Анализ текста</span></h1>
        <ThemeSelector />
    </header>
    <div class="w-full z-0 h-screen flex flex-col mt-25">
        <main class="flex-1 flex m-2 gap-2 min-h-0 min-w-0">
            <div class="flex-1 flex flex-col gap-2 min-h-0 min-w-0">
                <TextareaHighlighted v-model="textProcessor.text" class="flex-1 w-full h-full min-w-0" />
                <div class="flex gap-2">
                    <Button class="flex-1 h-11" @click="textProcessor.analyze">Проверить</Button>
                    <CopyButton :text="textStyle.GetFilteredText(textProcessor.text, textStyle.all)" />
                </div>
            </div>
            <div class="border rounded-md flex-1 min-w-0">
                <SimpleAnalysis />
            </div>
        </main>
    </div>
    <Toaster rich-colors theme="dark" />
</template>