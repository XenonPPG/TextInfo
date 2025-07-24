<script setup lang="ts">
import {Label} from '@/components/ui/label'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field'

const props = defineProps({
  label: String,
})

const id = 'field_' + props.label;
</script>

<template>
  <NumberField :id="id" class="-mt-1.5">
    <Label :for="id">{{}}</Label>
    <NumberFieldContent>
      <NumberFieldDecrement/>
      <NumberFieldInput class="bg-secondary/50"/>
      <NumberFieldIncrement/>
    </NumberFieldContent>
  </NumberField>
</template>