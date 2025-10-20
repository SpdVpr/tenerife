'use client';

import { useState, useEffect } from 'react';
import { Download, Upload, RefreshCw, CheckCircle, XCircle, Clock, Link as LinkIcon, Copy, Check } from 'lucide-react';
import { getSyncLogs, type SyncLog } from '@/lib/firebase/syncLogs';

export default function ICalIntegration() {
  const [icalUrl, setICalUrl] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [exportUrl, setExportUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Set export URL
    const baseUrl = window.location.origin;
    setExportUrl(`${baseUrl}/api/ical/export`);

    // Load saved iCal URL from localStorage
    const savedUrl = localStorage.getItem('booking_com_ical_url');
    if (savedUrl) {
      setICalUrl(savedUrl);
    }

    // Load sync logs from Firebase
    loadSyncLogs();
  }, []);

  const loadSyncLogs = async () => {
    try {
      const logs = await getSyncLogs(50); // Load last 50 logs
      setSyncLogs(logs);
      console.log('📋 Loaded sync logs:', logs.length);
    } catch (error) {
      console.error('❌ Error loading sync logs:', error);
    }
  };

  const handleSync = async () => {
    if (!icalUrl) {
      alert('Prosím zadejte iCal URL z Booking.com');
      return;
    }

    setIsSyncing(true);
    try {
      // Save URL to localStorage
      localStorage.setItem('booking_com_ical_url', icalUrl);

      const response = await fetch('/api/ical/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ icalUrl }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Reload logs from Firebase to show the new entry
        await loadSyncLogs();
        alert(`✅ Synchronizace dokončena: ${data.import.imported} importováno, ${data.import.skipped} přeskočeno`);
      } else {
        alert(`❌ Chyba: ${data.message || 'Neznámá chyba'}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Neznámá chyba';
      alert(`❌ Chyba: ${errorMessage}`);
    } finally {
      setIsSyncing(false);
    }
  };



  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">📅 iCal Synchronizace s Booking.com</h2>
        <p className="text-gray-600">
          Přímá synchronizace kalendářů přes iCal formát bez prostředníka Beds24
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Jak to funguje:</h3>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li><strong>Export:</strong> Váš web exportuje rezervace jako iCal kalendář</li>
          <li><strong>Import:</strong> Váš web importuje rezervace z Booking.com iCal URL</li>
          <li><strong>Frekvence:</strong> Booking.com aktualizuje každých 1-12 hodin, váš web každou hodinu</li>
          <li><strong>Automatizace:</strong> Synchronizace běží automaticky každou hodinu</li>
        </ul>
      </div>

      {/* Export Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Download className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">1. Export do Booking.com</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Zkopírujte tuto URL a vložte ji do Booking.com extranet → Calendar → Calendar sync
        </p>

        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={exportUrl}
            readOnly
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
          />
          <button
            onClick={() => copyToClipboard(exportUrl)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Zkopírováno' : 'Kopírovat'}</span>
          </button>
        </div>
      </div>

      {/* Import Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Upload className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">2. Import z Booking.com</h3>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Vložte iCal export URL z Booking.com extranet → Calendar → Calendar sync
        </p>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <LinkIcon className="w-4 h-4 text-gray-400" />
            <input
              type="url"
              value={icalUrl}
              onChange={(e) => setICalUrl(e.target.value)}
              placeholder="https://admin.booking.com/hotel/hoteladmin/ical.html?t=..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleSync}
              disabled={isSyncing || !icalUrl}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {isSyncing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synchronizuji...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Plná synchronizace</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Sync Logs */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Historie synchronizace</h3>
          </div>
          <button
            onClick={loadSyncLogs}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center space-x-1"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Obnovit</span>
          </button>
        </div>

        {syncLogs.length === 0 ? (
          <p className="text-gray-500 text-sm">Zatím žádné záznamy</p>
        ) : (
          <div className="space-y-2">
            {syncLogs.map((log, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  log.status === 'success'
                    ? 'bg-green-50 border-green-200'
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {log.status === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {log.type === 'sync' ? '🔄 Synchronizace' : log.type === 'import' ? '📥 Import' : '📤 Export'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {log.timestamp instanceof Date
                          ? log.timestamp.toLocaleString('cs-CZ')
                          : new Date(log.timestamp).toLocaleString('cs-CZ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{log.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Automatic Sync Info */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-semibold text-yellow-900 mb-2">⚡ Automatická synchronizace</h3>
        <p className="text-sm text-yellow-800">
          Synchronizace běží automaticky každou hodinu pomocí Vercel Cron.
          Můžete také spustit manuální synchronizaci kdykoliv pomocí tlačítek výše.
        </p>
      </div>
    </div>
  );
}

