import { defineStore } from 'pinia'
import { ref, reactive, nextTick } from 'vue'

export const useTextProcessor = defineStore('TextProcessor', () => {
  // const text = ref('');
  const text = ref(RandomString(Math.floor(Math.random() * 1000 + 1000)));
  const loading = ref(true);

  function RandomString(length){
    const characters = '1234567890qwertyuiop[]asdfghjkl;zxcvbnm,./QWERTYUIOP[       ]\\ASDFGHJKL;ZXCVBNM,./1234567890-=-=';
    var result = '';
    for(var i = 0; i < length; i++){
      result += characters[Math.floor(Math.random() * characters.length)];
    }
    return result;
  }

  const parameters = reactive({
    simple: {
      characters: {
        characters: {
          icon: 'radix-icons:cursor-text',
          fn: () => [...text.value]
        },
        digits: {
          icon: 'lucide:binary',
          fn: () => regex(/\p{N}/gu)
        },
        letters: {
          icon: 'radix-icons:letter-case-capitalize',
          fn: () => regex(/\p{L}/gu)
        },
        other: {
          icon: 'radix-icons:frame',
          fn: () => {
            const ch = parameters.simple.characters;
            const normal = new Set([...ch.letters.fn(), ...ch.digits.fn(), ...ch.spaces.fn()]);
            return [...text.value].filter(ch => !normal.has(ch))
          }
        },
        uppercase: {
          icon: 'radix-icons:letter-case-uppercase',
          fn: () => regex(/\p{Lu}/gu)
        },
        spaces: {
          icon: 'radix-icons:transparency-grid',
          fn: () => regex(/ /g)
        },
        lowercase: {
          icon: 'radix-icons:letter-case-lowercase',
          fn: () => regex(/\p{Ll}/gu)
        },
      },
      words: {
        words: {
          icon: 'radix-icons:dots-horizontal',
          fn: () => text.value.split(' ')
        },
        average_length:{
          icon: 'radix-icons:width',
          fn: () => parameters.simple.words.words.fn().map(item => item.trim().length).average().round(2)
        },
        longest:{
          icon: 'radix-icons:move',
          fn: () => parameters.simple.words.words.fn().reduce((longest, current) => current.length > longest.length ? current : longest)
        },
        longest_length:{
          icon: 'radix-icons:width',
          fn: () => parameters.simple.words.longest.fn().length
        }
      },
      sentences: {
        sentences: {
          icon: 'radix-icons:text-align-left',
          fn: () => text.value.trimEnd().split('.').filter((x, i) => x.startsWith(' ') || i == 0)
        },
        average_length: {
          icon: 'radix-icons:width',
          fn: () => parameters.simple.sentences.sentences.fn().map(item => item.trim().length).average().round(2)
        },
        longest:{
          icon: 'radix-icons:move',
          fn: () => parameters.simple.sentences.sentences.fn().reduce((longest, current) => current.length > longest.length ? current : longest)
        },
        longest_length:{
          icon: 'radix-icons:width',
          fn: () => parameters.simple.sentences.longest.fn().length
        }
      }
    }
  })

  function regex(exp) {
    return text.value.match(exp) || []
  }

  Number.prototype.round = function(digits) {
    const power = 10 ** digits;
    return Math.round(this * power) / power;
  };
  
  Array.prototype.average = function() {
    if(this.length == 0){
      return 0;
    }
    return this.reduce((sum, n) => sum + n) / this.length;
  };
  

  async function analyze() {
    loading.value = true;
    setTimeout(() => {
      for (const section of Object.values(parameters)) {
        for (const category of Object.values(section)) {
          for (const param of Object.values(category)) {
            param.val = param.fn() || 0;
          }
        }
      }

      loading.value = false;
    }, 0);
  }

  analyze();

  return { text, parameters, analyze, loading }
})