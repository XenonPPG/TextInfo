import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

export const useTextStyle = defineStore('TextStyle', () => {
  const allHighlights = ref([]);
  const all = reactive(new Set());
  const current = ref([]);

  function AddFilter(filter) {
    allHighlights.value.push(Array.isArray(filter) ? filter : [filter]);
    UpdateAll();
  }
  function RemoveFilter(filter) {
    allHighlights.value = allHighlights.value.filter(item => item !== filter);
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

  return { all, current, RemoveFilter, AddFilter }
})