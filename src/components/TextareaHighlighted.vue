<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { Textarea } from '@/components/ui/textarea/index.js'
import DOMPurify from 'dompurify'
import { useTextStyle } from '@/stores/TextStyle.js'

const text = defineModel()
const sanitized = ref(DOMPurify.sanitize(text.value || '', { ALLOWED_TAGS: [] }))
const textStyle = useTextStyle()

const HAText = ref('')
const highlightAllRef = ref(null)

const HCText = ref('')
const highlightCurrentRef = ref(null)

const textareaRef = ref(null)

const onScroll = () => {
  highlightAllRef.value.scrollTop = textareaRef.value.$el.scrollTop
  highlightCurrentRef.value.scrollLeft = textareaRef.value.$el.scrollLeft
}

onMounted(() => {
  const cs = getComputedStyle(textareaRef.value.$el)
  const css = `
    padding: ${cs.padding};
    font: ${cs.font};
    line-height: ${cs.lineHeight};
    box-sizing: ${cs.boxSizing};
  `
  highlightCurrentRef.value.style.cssText += css
  highlightAllRef.value.style.cssText += css
})

// Функция для подсветки текста
function Highlight(ref, filters, color) {
  if (!filters || filters.length === 0) {
    ref.value = sanitized.value
    return
  }

  const markers = textStyle.GetMerged(filters)

  if (!markers.length) {
    ref.value = sanitized.value
    return
  }

  let output = ''
  let pos = 0
  for (const m of markers) {
    if (pos < m.start) output += sanitized.value.slice(pos, m.start)
    output += `<span class="highlight-${color}">${sanitized.value.slice(m.start, m.end)}</span>`
    pos = m.end
  }
  if (pos < sanitized.value.length) {
    output += sanitized.value.slice(pos)
  }

  ref.value = output
}

watch(text, () => {
  sanitized.value = DOMPurify.sanitize(text.value || '', { ALLOWED_TAGS: [] })
})

watch(() => textStyle.current, () => {
  // current теперь содержит один объект фильтра или null
  const currentFilters = textStyle.current ? [textStyle.current] : []
  Highlight(HCText, currentFilters, 'primary')
}, { deep: true })

watch(() => textStyle.allHighlights, () => {
  Highlight(HAText, textStyle.allHighlights, 'secondary')
}, { deep: true })
</script>

<template>
  <div class="relative">
    <!-- current -->
    <div v-html="HCText" ref="highlightCurrentRef"
         class="absolute text-transparent border border-transparent inset-0 whitespace-pre-wrap break-words overflow-auto pointer-events-none z-1">
    </div>

    <!-- all -->
    <div v-html="HAText" ref="highlightAllRef"
         class="absolute bg-input/30 text-transparent border border-transparent inset-0 whitespace-pre-wrap break-words overflow-auto pointer-events-none z-0">
    </div>

    <Textarea ref="textareaRef" class="relative z-2 flex-1 w-full h-full min-w-0 resize-none
             overflow-auto !bg-transparent break-words whitespace-pre-wrap" v-model="text"
              @scroll="onScroll"></Textarea>
  </div>
</template>

<style>
.highlight-primary {
  background-color: #cb1143;
}

.highlight-secondary {
  background-color: #464078;
}
</style>