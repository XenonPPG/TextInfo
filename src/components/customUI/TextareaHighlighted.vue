<script setup>
import { ref, onMounted, defineModel, watch, nextTick } from 'vue'
import { Textarea } from '@/components/ui/textarea'
import DOMPurify from 'dompurify'
import { useTextStyle } from '@/stores/TextStyle.js'

const text = defineModel()
const textStyle = useTextStyle()

const displayText = ref('')
const textareaRef = ref(null)
const highlightRef = ref(null)

const onScroll = () => {
  highlightRef.value.scrollTop = textareaRef.value.$el.scrollTop
  highlightRef.value.scrollLeft = textareaRef.value.$el.scrollLeft
}

onMounted(() => {
  const cs = getComputedStyle(textareaRef.value.$el)
  highlightRef.value.style.cssText += `
    padding: ${cs.padding};
    font: ${cs.font};
    line-height: ${cs.lineHeight};
    box-sizing: ${cs.boxSizing};
  `
  Highlight()
})

function Highlight() {
  const raw = text.value || '';
  const sanitized = DOMPurify.sanitize(raw, { ALLOWED_TAGS: [] });

  const result = [];
  const markers = [];

  // 1. Собрать все вхождения из all (gray)
  for (const word of textStyle.all) {
    if (!word) continue;
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'g');
    let match;
    while ((match = regex.exec(sanitized))) {
      markers.push({ start: match.index, end: match.index + match[0].length, type: 'all' });
    }
  }

  // 2. current поверх — как "второй слой" (red)
  for (const word of textStyle.current) {
    if (!word) continue;
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'g');
    let match;
    while ((match = regex.exec(sanitized))) {
      markers.push({ start: match.index, end: match.index + match[0].length, type: 'current' });
    }
  }

  // 3. Сортировка и объединение
  markers.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start)); // длиннее — выше при одинаковом начале

  const merged = [];
  let last = null;

  for (const m of markers) {
    if (last && m.start < last.end) {
      // Перекрытие: current перекрывает all
      if (m.type === 'current') last.type = 'current';
      last.end = Math.max(last.end, m.end);
    } else {
      if (last) merged.push(last);
      last = { ...m };
    }
  }
  if (last) merged.push(last);

  // 4. Построение HTML
  let output = '';
  let pos = 0;

  for (const m of merged) {
    if (m.start > pos) output += sanitized.slice(pos, m.start);

    const spanClass = m.type === 'current'
      ? 'bg-red-500/70'
      : 'bg-gray-600/70';

    output += `<span class="${spanClass}">${sanitized.slice(m.start, m.end)}</span>`;
    pos = m.end;
  }

  if (pos < sanitized.length) {
    output += sanitized.slice(pos);
  }

  displayText.value = output;
}

watch(() => text.value, Highlight)
watch(() => textStyle.current, Highlight);
watch(() => Array.from(textStyle.all), Highlight, { deep: false })
</script>

<template>
  <div class="relative">
    <div v-html="displayText" ref="highlightRef"
      class="absolute bg-input/30 text-transparent border border-transparent inset-0 whitespace-pre-wrap break-words overflow-auto pointer-events-none z-0">
    </div>
    <Textarea ref="textareaRef" class="relative z-1 flex-1 w-full h-full min-w-0 resize-none
             overflow-auto !bg-transparent break-words whitespace-pre-wrap" v-model="text"
      @scroll="onScroll"></Textarea>
  </div>
</template>