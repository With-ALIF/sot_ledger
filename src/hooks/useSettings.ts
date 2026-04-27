import { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { settingsService } from '../services/settingsService';

export const useSettings = () => {
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsService.fetchSettings();
      setAppSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSaveSettings = async (newSettings: Partial<AppSettings>) => {
    try {
      const data = await settingsService.saveSettings(appSettings?.id, newSettings);
      if (data) {
        setAppSettings(data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error saving settings:', error);
      return false;
    }
  };

  return {
    appSettings,
    setAppSettings,
    loading,
    fetchSettings,
    handleSaveSettings
  };
};
