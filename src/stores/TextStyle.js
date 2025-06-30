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

  function GetMerged(text, filters) {
    if (!text || typeof text !== 'string') return [];

    // Проверяем, что filters - это массив
    if (!Array.isArray(filters)) {
      console.warn('GetMerged: filters должен быть массивом');
      return [];
    }

    const allMarkers = [];

    for (const filterObj of filters) {
      // Проверяем структуру объекта фильтра
      if (!filterObj || typeof filterObj !== 'object') {
        console.warn('GetMerged: неверная структура фильтра', filterObj);
        continue;
      }

      const { filter, unique } = filterObj;

      // Проверяем, что filter - это массив
      if (!Array.isArray(filter)) {
        console.warn('GetMerged: filter должен быть массивом', filter);
        continue;
      }

      // Убираем дубли из списка слов если нужно
      const wordList = unique ? [...new Set(filter)] : filter;
      const filterMarkers = [];
      const foundTexts = new Set(); // Для отслеживания уже найденных текстов в режиме unique

      for (const word of wordList) {
        if (!word || typeof word !== 'string') continue;

        const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escaped, 'gi');

        let match;
        while ((match = regex.exec(text))) {
          const foundText = match[0].toLowerCase(); // Приводим к нижнему регистру для сравнения

          // Если включена уникальность и такой текст уже найден - пропускаем
          if (unique && foundTexts.has(foundText)) {
            continue;
          }

          const marker = {
            start: match.index,
            end: match.index + match[0].length,
            text: match[0]
          };

          filterMarkers.push(marker);

          // Добавляем найденный текст в набор (для режима unique)
          if (unique) {
            foundTexts.add(foundText);
          }

          // Сбрасываем lastIndex для избежания бесконечного цикла
          if (match[0].length === 0) {
            regex.lastIndex++;
          }
        }

        // Сбрасываем lastIndex после каждого слова
        regex.lastIndex = 0;
      }

      // Добавляем все найденные маркеры (логика уникальности уже применена выше)
      allMarkers.push(...filterMarkers);
    }

    if (allMarkers.length === 0) return [];

    // Сортируем маркеры по позиции начала
    allMarkers.sort((a, b) => a.start - b.start);

    // Объединяем пересекающиеся маркеры
    const merged = [];
    let current = { start: allMarkers[0].start, end: allMarkers[0].end };

    for (let i = 1; i < allMarkers.length; i++) {
      const next = allMarkers[i];
      if (next.start <= current.end) {
        // Объединяем перекрывающиеся маркеры
        current.end = Math.max(current.end, next.end);
      } else {
        // Добавляем текущий маркер и переходим к следующему
        merged.push({ start: current.start, end: current.end });
        current = { start: next.start, end: next.end };
      }
    }

    // Не забываем добавить последний маркер
    merged.push({ start: current.start, end: current.end });

    return merged;
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