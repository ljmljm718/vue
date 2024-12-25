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
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    }
  },
  persist: false
});
