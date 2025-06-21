<script setup>
import TextParameter from '@/components/customUI/TextParameter.vue';
import Category from '@/components/customUI/Category.vue';
import { useTextProcessor } from '@/stores/TextProcessor';

const textProcessor = useTextProcessor();
</script>

<template>
    <div class="border rounded-md m-2 p-4">
        <h1 class="text-3xl text-primary">Простой анализ</h1>
        <div class="flex flex-col pt-4 gap-5">
            <Category v-for="(textParams, category) in textProcessor.parameters.simple" :label="category">
                <TextParameter v-for="(params, title) in textParams" :title="title" :icon="params.icon" :val="params.val || 0" :unique="false"/>
            </Category>
        </div>
    </div>
</template>