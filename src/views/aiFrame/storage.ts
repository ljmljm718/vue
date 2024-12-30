import { defineStore } from 'pinia';

interface AiFrameState {
  enableDarkMode: boolean;
}

export const useAiFrameStore = defineStore('aiFrame', {
  state: (): AiFrameState => {
    return {
      enableDarkMode: false
    };
  },
  getters: {
    getEnableDarkMode(): boolean {
      return this.enableDarkMode;
    }
  },
  actions: {
    setEnableDarkMode(darkMode: boolean) {
      this.enableDarkMode = darkMode;
      if (darkMode) {
        localStorage.setItem('AI_PAGE_THEME', 'dark');
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        localStorage.setItem('AI_PAGE_THEME', 'light');
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    }
  },
  persist: false
});
