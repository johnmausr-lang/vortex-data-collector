const STORAGE_KEY = 'vortex_offline_surveys';

export const offlineStorage = {
  // Сохранить анкету локально
  saveSurvey: (data) => {
    try {
      if (typeof window === 'undefined') return false;
      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const newEntry = {
        ...data,
        timestamp: new Date().toISOString(),
        local_id: crypto.randomUUID()
      };
      existing.push(newEntry);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
      return true;
    } catch (e) {
      console.error('Ошибка сохранения в LocalStorage:', e);
      return false;
    }
  },

  // Получить все отложенные анкеты
  getPendingSurveys: () => {
    try {
      if (typeof window === 'undefined') return [];
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) {
      return [];
    }
  },

  // Очистить очередь после успешной отправки
  clearStorage: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
};
