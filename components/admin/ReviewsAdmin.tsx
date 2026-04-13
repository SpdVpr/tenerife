'use client';

import { useEffect, useState } from 'react';
import { Star, Check, X, Loader2, RefreshCw, Mail, Pencil, Save, Settings } from 'lucide-react';
import { getAllReviews, ReviewDocument, getReviewSettings, updateReviewSettings } from '@/lib/firebase/reviews';

type Filter = 'all' | 'pending' | 'approved' | 'rejected';

interface EditState {
  guestName: string;
  rating: number;
  comment: string;
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  pending: { label: 'Čekající', className: 'bg-yellow-100 text-yellow-800' },
  approved: { label: 'Schválená', className: 'bg-green-100 text-green-800' },
  rejected: { label: 'Zamítnutá', className: 'bg-red-100 text-red-800' },
};

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
        >
          <Star
            className={`w-5 h-5 transition-colors ${
              star <= (hovered || value)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

export default function ReviewsAdmin() {
  const [reviews, setReviews] = useState<ReviewDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editState, setEditState] = useState<EditState>({ guestName: '', rating: 0, comment: '' });
  const [checkingPending, setCheckingPending] = useState(false);
  const [pendingCheckResult, setPendingCheckResult] = useState<string | null>(null);

  // Settings
  const [autoEmailDays, setAutoEmailDays] = useState(3);
  const [daysInput, setDaysInput] = useState('3');
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      const data = await getAllReviews();
      setReviews(data);
    } catch (err) {
      console.error('Error loading reviews:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
    getReviewSettings().then((s) => {
      setAutoEmailDays(s.autoEmailDays);
      setDaysInput(String(s.autoEmailDays));
    });
  }, []);

  // ── Approve / reject ───────────────────────────────────────────────────────
  const handleAction = async (reviewId: string, action: 'approve' | 'reject') => {
    setActionLoading((prev) => ({ ...prev, [reviewId]: true }));
    try {
      const response = await fetch('/api/reviews/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, action }),
      });
      if (response.ok) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId
              ? { ...r, status: action === 'approve' ? 'approved' : 'rejected', moderatedAt: new Date() }
              : r
          )
        );
      } else {
        const data = await response.json();
        alert(`Chyba: ${data.error}`);
      }
    } catch {
      alert('Chyba při aktualizaci recenze');
    } finally {
      setActionLoading((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

  // ── Edit ───────────────────────────────────────────────────────────────────
  const startEdit = (review: ReviewDocument) => {
    setEditingId(review.id);
    setEditState({ guestName: review.guestName, rating: review.rating, comment: review.comment });
  };

  const cancelEdit = () => setEditingId(null);

  const saveEdit = async (reviewId: string) => {
    setActionLoading((prev) => ({ ...prev, [reviewId]: true }));
    try {
      const response = await fetch('/api/reviews/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId, ...editState }),
      });
      if (response.ok) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId ? { ...r, ...editState } : r
          )
        );
        setEditingId(null);
      } else {
        const data = await response.json();
        alert(`Chyba: ${data.error}`);
      }
    } catch {
      alert('Chyba při ukládání recenze');
    } finally {
      setActionLoading((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

  // ── Check pending ──────────────────────────────────────────────────────────
  const handleCheckPending = async () => {
    setCheckingPending(true);
    setPendingCheckResult(null);
    try {
      const response = await fetch('/api/reviews/send-pending', { method: 'POST' });
      const data = await response.json();
      if (response.ok) {
        setPendingCheckResult(
          `Odesláno: ${data.sent} email${data.sent !== 1 ? 'ů' : ''}. Přeskočeno: ${data.skipped}.`
        );
      } else {
        setPendingCheckResult(`Chyba: ${data.error}`);
      }
    } catch {
      setPendingCheckResult('Chyba při kontrole čekajících recenzí');
    } finally {
      setCheckingPending(false);
    }
  };

  // ── Save settings ──────────────────────────────────────────────────────────
  const handleSaveSettings = async () => {
    const days = parseInt(daysInput, 10);
    if (isNaN(days) || days < 1 || days > 30) {
      alert('Zadejte číslo od 1 do 30');
      return;
    }
    setSavingSettings(true);
    try {
      await updateReviewSettings({ autoEmailDays: days });
      setAutoEmailDays(days);
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 3000);
    } catch {
      alert('Nepodařilo se uložit nastavení');
    } finally {
      setSavingSettings(false);
    }
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const filtered = reviews.filter((r) => filter === 'all' || r.status === filter);
  const counts = {
    all: reviews.length,
    pending: reviews.filter((r) => r.status === 'pending').length,
    approved: reviews.filter((r) => r.status === 'approved').length,
    rejected: reviews.filter((r) => r.status === 'rejected').length,
  };
  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: `Vše (${counts.all})` },
    { key: 'pending', label: `Čekající (${counts.pending})` },
    { key: 'approved', label: `Schválené (${counts.approved})` },
    { key: 'rejected', label: `Zamítnuté (${counts.rejected})` },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">⭐ Správa recenzí</h2>
          <p className="text-gray-600 mt-1">Schvalte, upravte nebo zamítněte recenze od hostů</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowSettings((v) => !v)}
            className={`flex items-center gap-1 px-3 py-2 rounded transition-colors text-sm ${
              showSettings ? 'bg-primary-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            Nastavení
          </button>
          <button
            onClick={loadReviews}
            className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Obnovit
          </button>
          <button
            onClick={handleCheckPending}
            disabled={checkingPending}
            className="flex items-center gap-1 px-3 py-2 bg-primary-blue text-white rounded hover:bg-blue-700 transition-colors text-sm disabled:opacity-60"
          >
            {checkingPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            Zkontrolovat čekající
          </button>
        </div>
      </div>

      {/* Settings panel */}
      {showSettings && (
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-primary-blue">
          <h3 className="font-semibold text-gray-900 mb-1">Automatické emaily — nastavení</h3>
          <p className="text-sm text-gray-500 mb-4">
            Za kolik dní od konce pobytu se hostovi automaticky odešle žádost o recenzi.
          </p>
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Počet dní po odjezdu:
            </label>
            <input
              type="number"
              min={1}
              max={30}
              value={daysInput}
              onChange={(e) => setDaysInput(e.target.value)}
              className="w-20 border border-gray-300 rounded px-3 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary-blue"
            />
            <button
              onClick={handleSaveSettings}
              disabled={savingSettings}
              className="flex items-center gap-1 px-4 py-1.5 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors disabled:opacity-60"
            >
              {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Uložit
            </button>
            {settingsSaved && (
              <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                <Check className="w-4 h-4" /> Uloženo
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Aktuální nastavení: email se odesílá <strong>{autoEmailDays} {autoEmailDays === 1 ? 'den' : autoEmailDays < 5 ? 'dny' : 'dní'}</strong> po odjezdu.
          </p>
        </div>
      )}

      {/* Pending check result */}
      {pendingCheckResult && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
          {pendingCheckResult}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {filters.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === key ? 'bg-primary-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-primary-blue animate-spin" />
          <span className="ml-3 text-gray-600">Načítám recenze...</span>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filtered.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">
            {filter === 'all' ? 'Zatím žádné recenze' : `Žádné ${filters.find((f) => f.key === filter)?.label.toLowerCase()}`}
          </p>
        </div>
      )}

      {/* Reviews list */}
      {!isLoading && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((review) => {
            const statusInfo = STATUS_LABELS[review.status];
            const isActing = actionLoading[review.id];
            const isEditing = editingId === review.id;

            return (
              <div key={review.id} className="bg-white rounded-lg shadow p-6">
                {isEditing ? (
                  /* ── Edit form ────────────────────────────────────────── */
                  <div className="space-y-4">
                    <p className="text-sm font-semibold text-gray-700">Úprava recenze</p>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Jméno hosta</label>
                      <input
                        type="text"
                        value={editState.guestName}
                        onChange={(e) => setEditState((s) => ({ ...s, guestName: e.target.value }))}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Hodnocení</label>
                      <StarPicker
                        value={editState.rating}
                        onChange={(v) => setEditState((s) => ({ ...s, rating: v }))}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Komentář</label>
                      <textarea
                        rows={4}
                        value={editState.comment}
                        onChange={(e) => setEditState((s) => ({ ...s, comment: e.target.value }))}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue resize-none"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(review.id)}
                        disabled={isActing}
                        className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors disabled:opacity-60"
                      >
                        {isActing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Uložit
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={isActing}
                        className="flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Zrušit
                      </button>
                    </div>
                  </div>
                ) : (
                  /* ── View mode ────────────────────────────────────────── */
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    {/* Left: content */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <StarDisplay rating={review.rating} />
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusInfo.className}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="font-semibold text-gray-900">{review.guestName}</p>
                      <p className="text-gray-700 text-sm leading-relaxed">&ldquo;{review.comment}&rdquo;</p>
                      <div className="flex gap-4 text-xs text-gray-500 flex-wrap">
                        <span>
                          Pobyt: {new Date(review.checkIn).toLocaleDateString('cs-CZ')} –{' '}
                          {new Date(review.checkOut).toLocaleDateString('cs-CZ')}
                        </span>
                        <span>Odesláno: {review.createdAt.toLocaleDateString('cs-CZ')}</span>
                        {review.moderatedAt && (
                          <span>Moderováno: {review.moderatedAt.toLocaleDateString('cs-CZ')}</span>
                        )}
                      </div>
                    </div>

                    {/* Right: actions */}
                    <div className="flex flex-col gap-2 shrink-0">
                      {/* Edit button — always visible */}
                      <button
                        onClick={() => startEdit(review)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors"
                        title="Upravit recenzi"
                      >
                        <Pencil className="w-4 h-4" />
                        Upravit
                      </button>

                      {/* Approve / reject — only for pending */}
                      {review.status === 'pending' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAction(review.id, 'approve')}
                            disabled={isActing}
                            className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors disabled:opacity-60"
                            title="Schválit"
                          >
                            {isActing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            Schválit
                          </button>
                          <button
                            onClick={() => handleAction(review.id, 'reject')}
                            disabled={isActing}
                            className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors disabled:opacity-60"
                            title="Zamítnout"
                          >
                            {isActing ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                            Zamítnout
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
