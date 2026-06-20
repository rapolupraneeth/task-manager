import Layout from '../components/Layout';

const Settings = () => {
  return (
    <Layout>
      <div className="sticky top-0 z-10 flex items-center px-8 h-16 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Settings</h1>
      </div>
      <div className="flex flex-col items-center justify-center h-96 text-center px-8">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
          <span className="text-3xl">⚙️</span>
        </div>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
          Account settings, preferences, and notifications will be available here in a future update.
        </p>
      </div>
    </Layout>
  );
};

export default Settings;