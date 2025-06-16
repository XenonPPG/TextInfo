<script setup>
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import ThemeSelector from '@/components/ThemeSelector.vue';
import Textarea from '@/components/ui/textarea/Textarea.vue';
import SimpleAnalysis from '@/components/SimpleAnalysis.vue';
import { useTextProcessor } from '@/stores/TextProcessor.js';
import TextareaHighlighted from '@/components/customUI/TextareaHighlighted.vue';

const textProcessor = useTextProcessor();

</script>

<template>
    <div class="w-screen h-screen flex flex-col">
        <header class="flex justify-between items-center border-b border-dashed p-5">
            <h1 class="text-6xl">TextInfo <span class="text-4xl text-primary">Анализ текста</span></h1>
            <ThemeSelector />
        </header>
        <main class="flex-1 flex m-2 gap-2 min-h-0 min-w-0">
            <div class="flex-1 flex flex-col gap-2 min-h-0 min-w-0">
                <!-- <Textarea v-model="textProcessor.text" class=" " /> -->
                <TextareaHighlighted v-model="textProcessor.text" class="flex-1 w-full h-full min-w-0"/>
                <Button @click="textProcessor.analyze">Проверить</Button>
            </div>
            <div class="border rounded-md flex-1 min-w-0">
                <SimpleAnalysis />
            </div>
        </main>
    </div>
</template>

<style scoped></style>