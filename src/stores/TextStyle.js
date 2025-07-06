import { defineStore } from 'pinia'
import { ref, reactive, h, Fragment } from 'vue'

export const useTextStyle = defineStore('TextStyle', () => {
  const allHighlights = ref([]);
  const all = reactive(new Set());
  const current = ref(null);

  function Normalize(filter) {
    const normalized = Array.isArray(filter.filter) ? filter.filter : [filter.filter];
    return { filter: normalized, unique: !!filter.unique };
  }

  function AddFilter(filterObj) {
    allHighlights.value.push(Normalize(filterObj));
    UpdateAll();
  }

  function RemoveFilter(filterObj) {
    const target = JSON.stringify(Normalize(filterObj));
    allHighlights.value = allHighlights.value.filter(item => JSON.stringify(item) !== target);
    UpdateAll();
  }

  function UpdateAll() {
    all.clear();
    if (allHighlights.value.length <= 0) return;

    allHighlights.value.forEach(({ filter, unique }) => {
      const items = unique ? [...new Set(filter)] : filter;
      items.forEach(item => {
        all.add(item);
      });
    });
  }

  // --- Новый код ниже ---

  function getFilterMatches(text, filters) {
    const ranges = new Set();

    for (const { filter, unique } of filters) {
      const matched = new Set();

      for (const term of filter) {
        const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escaped, 'gi');
        let match;

        while ((match = regex.exec(text)) !== null) {
          const start = match.index;
          const end = start + match[0].length;

          if (unique) {
            if (!matched.has(term)) {
              ranges.add(`${start}-${end}`);
              matched.add(term);
            }
          } else {
            ranges.add(`${start}-${end}`);
          }

          if (match[0].length === 0) regex.lastIndex++;
        }
        regex.lastIndex = 0;
      }
    }

    return Array.from(ranges).map(r => {
      const [start, end] = r.split('-').map(Number);
      return { start, end };
    });
  }

  function mergeRanges(ranges) {
    if (!ranges.length) return [];

    const sorted = ranges.slice().sort((a, b) => a.start - b.start);
    const result = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
      const prev = result[result.length - 1];
      const current = sorted[i];

      if (current.start <= prev.end) {
        prev.end = Math.max(prev.end, current.end);
      } else {
        result.push(current);
      }
    }

    return result;
  }

  function GetMerged(text, filters) {
    if (!text || typeof text !== 'string') return [];
    if (!Array.isArray(filters)) return [];

    const rawMatches = getFilterMatches(text, filters);
    return mergeRanges(rawMatches);
  }

  function GetFilteredText(text, filters) {
    if (!text || typeof text !== 'string') return '';

    const merged = GetMerged(text, filters);
    return merged.map(item => text.slice(item.start, item.end)).join('');
  }

  function ClampVal(val, max_length, for_sonner = false) {
    if (val === null || val === undefined) val = '';
    val = val.toString();

    if (max_length <= 0) return '';

    const exceedsLimit = val.length > max_length;
    const trimmed = val.slice(0, max_length).trimEnd();

    if (!exceedsLimit) return trimmed;

    if (!for_sonner) {
      return trimmed + '<span class="text-gray-500">...</span>';
    }

    return h(Fragment, null, [
      trimmed,
      h('span', { class: 'text-gray-500' }, '...')
    ]);
  }

  return {
    all,
    current,
    allHighlights,
    Normalize,
    RemoveFilter,
    AddFilter,
    UpdateAll,
    GetMerged,
    GetFilteredText,
    ClampVal
  };
});
