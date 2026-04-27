import AdminSettings from '../../components/admin/AdminSettings';
import { useSettings } from '../../hooks/useSettings';

export default function AdminSettingsPage() {
  const { appSettings, handleSaveSettings, loading } = useSettings();

  return (
    <AdminSettings 
      settings={appSettings} 
      onSave={handleSaveSettings} 
      loading={loading} 
    />
  );
}
