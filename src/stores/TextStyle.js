import { defineStore } from 'pinia'
import { ref, reactive, h, Fragment } from 'vue'
import { useTextProcessor } from '@/stores/TextProcessor.js';

export const useTextStyle = defineStore('TextStyle', () => {

  const textProcessor = useTextProcessor();

  const allHighlights = ref([]);
  const all = reactive(new Set());
  const current = ref([]);

  function Normalize(filter) {
    return Array.isArray(filter) ? filter : [filter];
  }
  function AddFilter(filter) {
    allHighlights.value.push(Normalize(filter));
    UpdateAll();
  }
  function RemoveFilter(filter) {
    allHighlights.value = allHighlights.value.filter(item => JSON.stringify(item) !== JSON.stringify(Normalize(filter)));
    UpdateAll();
  }
  function UpdateAll() {
    all.clear();
    if (allHighlights.value.length <= 0) return;

    allHighlights.value.forEach(filter => {
      filter.forEach(item => {
        all.add(item);
      })
    })
  }
  function GetMerged(filters) {
    const markers = [];
  
    // Определяем, включён ли флаг уникальности
    const isUnique = textProcessor.uniqueFlag;
  
    // Если включён — убираем дубликаты
    const entries = isUnique ? [...new Set(filters)] : filters;
  
    for (const word of entries) {
      if (!word) continue;
  
      const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'g');
  
      let match;
      while ((match = regex.exec(textProcessor.text))) {
        markers.push({ start: match.index, end: match.index + match[0].length });
        regex.lastIndex = match.index + match[0].length; // избегаем перекрытий
      }
    }
  
    if (markers.length === 0) return [];
  
    // Сортировка и слияние
    markers.sort((a, b) => a.start - b.start);
  
    const merged = [];
    let last = markers[0];
  
    for (let i = 1; i < markers.length; i++) {
      const curr = markers[i];
      if (curr.start <= last.end) {
        last.end = Math.max(last.end, curr.end);
      } else {
        merged.push(last);
        last = curr;
      }
    }
    merged.push(last);
  
    return merged;
  }
  
  function GetFilteredText(text, filters) {
    return GetMerged(text, filters).map(item => text.slice(item.start, item.end)).join('');
  }
  function ClampVal(val, max_length, for_sonner = false) {
    val = val.toString();
    const exceedsLimit = val.length > max_length;
    const trimmed = val.slice(0, max_length).trimEnd();
  
    if (!exceedsLimit) return trimmed;
  
    if (!for_sonner) return trimmed + '<span class="text-gray-500">...</span>';
  
    return h(Fragment, null, [
      trimmed,
      h('span', { class: 'text-gray-500' }, '...')
    ]);
  }

  return { all, current, Normalize, RemoveFilter, AddFilter, GetMerged, GetFilteredText, ClampVal }
})