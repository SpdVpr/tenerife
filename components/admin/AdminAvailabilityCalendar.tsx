'use client';

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getOccupiedDatesWithSource } from '@/lib/firebase/bookings';
import { Loader2, RefreshCw } from 'lucide-react';

interface DateInfo {
  date: string;
  fromWeb: boolean;
  fromBookingCom: boolean;
}

export default function AdminAvailabilityCalendar() {
  const [dateInfo, setDateInfo] = useState<Map<string, DateInfo>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    loadAllOccupiedDates();
  }, []);

  const loadAllOccupiedDates = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Fetch all occupied dates with source information from Firebase
      const occupiedDatesWithSource = await getOccupiedDatesWithSource();
      console.log('📅 Loaded occupied dates:', occupiedDatesWithSource.length);

      // Build date map with source information
      const dateMap = new Map<string, DateInfo>();

      occupiedDatesWithSource.forEach(({ date, sources }) => {
        const dateInfo: DateInfo = {
          date,
          fromWeb: sources.includes('web'),
          fromBookingCom: sources.includes('booking.com')
        };
        dateMap.set(date, dateInfo);

        // Debug log for first few dates
        if (dateMap.size <= 5) {
          console.log(`📅 Date ${date}:`, { fromWeb: dateInfo.fromWeb, fromBookingCom: dateInfo.fromBookingCom, sources });
        }
      });

      console.log('📅 Total dates in map:', dateMap.size);
      console.log('📅 Web dates:', Array.from(dateMap.values()).filter(d => d.fromWeb).length);
      console.log('📅 Booking.com dates:', Array.from(dateMap.values()).filter(d => d.fromBookingCom).length);

      setDateInfo(dateMap);
      setLastSync(new Date());
    } catch (err) {
      console.error('Error loading occupied dates:', err);
      setError('Chyba při načítání rezervací');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateStr = formatDate(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dateInfo_ = dateInfo.get(dateStr);

      // Past dates
      if (date < today) {
        return 'past-date';
      }

      // Determine style based on booking sources
      if (dateInfo_) {
        const sourceCount = [dateInfo_.fromWeb, dateInfo_.fromBookingCom].filter(Boolean).length;

        if (sourceCount > 1) {
          // Multiple sources
          return 'occupied-multiple';
        } else if (dateInfo_.fromWeb) {
          return 'occupied-web';
        } else if (dateInfo_.fromBookingCom) {
          return 'occupied-booking';
        }
      }

      // Available dates
      return 'available-date';
    }
    return null;
  };

  const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Disable past dates
      if (date < today) {
        return true;
      }

      // Disable occupied dates (any source)
      const dateStr = formatDate(date);
      const info = dateInfo.get(dateStr);
      return info ? (info.fromWeb || info.fromBookingCom) : false;
    }
    return false;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary-blue animate-spin" />
        <span className="ml-3 text-gray-600">Načítám kalendář...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="availability-calendar-wrapper">
        <style jsx global>{`
          .availability-calendar-wrapper {
            width: 100%;
          }

          .react-calendar {
            width: 100%;
            border: none;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            padding: 20px;
            background: white;
            font-family: inherit;
          }

          .react-calendar__navigation {
            margin-bottom: 20px;
          }

          .react-calendar__navigation button {
            min-width: 44px;
            background: none;
            font-size: 16px;
            font-weight: 600;
            color: #1f2937;
          }

          .react-calendar__navigation button:enabled:hover,
          .react-calendar__navigation button:enabled:focus {
            background-color: #f3f4f6;
            border-radius: 8px;
          }

          .react-calendar__month-view__weekdays {
            text-align: center;
            text-transform: uppercase;
            font-weight: 600;
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 10px;
          }

          .react-calendar__tile {
            padding: 12px 6px;
            background: none;
            text-align: center;
            line-height: 16px;
            font-size: 14px;
            border-radius: 8px;
            position: relative;
          }

          .react-calendar__tile:enabled:hover,
          .react-calendar__tile:enabled:focus {
            background-color: #e0f2fe;
          }

          .react-calendar__tile--now {
            background: #dbeafe;
            font-weight: 600;
          }

          /* Custom styles for availability */
          .available-date {
            background-color: #d1fae5;
            color: #065f46;
          }

          .available-date:enabled:hover {
            background-color: #a7f3d0 !important;
          }

          /* Web bookings only */
          .occupied-web {
            background-color: #fee2e2;
            color: #991b1b;
            cursor: not-allowed;
            opacity: 0.7;
          }

          /* Booking.com bookings only */
          .occupied-booking {
            background-color: #bfdbfe;
            color: #1e40af;
            cursor: not-allowed;
            opacity: 0.7;
          }

          /* Multiple sources */
          .occupied-multiple {
            background: linear-gradient(135deg, #fee2e2 50%, #bfdbfe 50%);
            color: #7c2d12;
            cursor: not-allowed;
            opacity: 0.8;
          }

          .past-date {
            color: #d1d5db;
            cursor: not-allowed;
          }

          .react-calendar__tile:disabled {
            background-color: transparent;
            cursor: not-allowed;
          }
        `}</style>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Kalendář dostupnosti</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={loadAllOccupiedDates}
                disabled={isLoading}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-primary-blue text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Obnovit
              </button>
              {lastSync && (
                <span className="text-xs text-gray-500">
                  Poslední sync: {lastSync.toLocaleTimeString('cs-CZ')}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-200 border border-green-300"></div>
              <span className="text-gray-700">Dostupné</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-200 border border-red-300"></div>
              <span className="text-gray-700">Web</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-200 border border-blue-300"></div>
              <span className="text-gray-700">Booking.com</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded border border-gray-300"
                style={{
                  background: 'linear-gradient(135deg, #fee2e2 50%, #bfdbfe 50%)',
                }}
              ></div>
              <span className="text-gray-700">Více zdrojů</span>
            </div>
          </div>
        </div>

        <Calendar
          value={null}
          selectRange={false}
          minDate={new Date()}
          tileClassName={tileClassName}
          tileDisabled={tileDisabled}
          locale="cs-CZ"
          prev2Label={null}
          next2Label={null}
        />
      </div>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <p className="text-sm text-gray-600 mb-1">Web rezervace</p>
          <p className="text-2xl font-bold text-red-600">{Array.from(dateInfo.values()).filter(d => d.fromWeb).length}</p>
          <p className="text-xs text-gray-500 mt-1">dnů</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-gray-600 mb-1">Booking.com</p>
          <p className="text-2xl font-bold text-blue-600">{Array.from(dateInfo.values()).filter(d => d.fromBookingCom).length}</p>
          <p className="text-xs text-gray-500 mt-1">dnů</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <p className="text-sm text-gray-600 mb-1">Celkem obsazeno</p>
          <p className="text-2xl font-bold text-orange-600">{dateInfo.size}</p>
          <p className="text-xs text-gray-500 mt-1">dnů</p>
        </div>
      </div>
    </div>
  );
}