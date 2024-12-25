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
    }
  },
  persist: false
});
