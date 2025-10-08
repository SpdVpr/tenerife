'use client';

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { getOccupiedDates } from '@/lib/firebase/bookings';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface AvailabilityCalendarProps {
  onDateSelect?: (checkIn: string, checkOut: string) => void;
  selectedCheckIn?: string;
  selectedCheckOut?: string;
}

export default function AvailabilityCalendar({
  onDateSelect,
  selectedCheckIn,
  selectedCheckOut
}: AvailabilityCalendarProps) {
  const { language } = useLanguage();
  const [occupiedDates, setOccupiedDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<Value>(null);

  useEffect(() => {
    loadOccupiedDates();
  }, []);

  useEffect(() => {
    // Update calendar when external dates change
    if (selectedCheckIn && selectedCheckOut) {
      setDateRange([new Date(selectedCheckIn), new Date(selectedCheckOut)]);
    }
  }, [selectedCheckIn, selectedCheckOut]);

  const loadOccupiedDates = async () => {
    try {
      setIsLoading(true);
      const dates = await getOccupiedDates();
      setOccupiedDates(dates);
    } catch (error) {
      console.error('Error loading occupied dates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isDateOccupied = (date: Date): boolean => {
    const dateStr = date.toISOString().split('T')[0];
    return occupiedDates.includes(dateStr);
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Past dates
      if (date < today) {
        return 'past-date';
      }

      // Occupied dates
      if (occupiedDates.includes(dateStr)) {
        return 'occupied-date';
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

      // Disable occupied dates
      return isDateOccupied(date);
    }
    return false;
  };

  const handleDateChange = (value: Value) => {
    setDateRange(value);

    if (Array.isArray(value) && value[0] && value[1]) {
      const checkIn = value[0].toISOString().split('T')[0];
      const checkOut = value[1].toISOString().split('T')[0];
      
      // Check if any date in the range is occupied
      const start = new Date(value[0]);
      const end = new Date(value[1]);
      let hasOccupiedDate = false;

      const currentDate = new Date(start);
      while (currentDate <= end) {
        if (isDateOccupied(currentDate)) {
          hasOccupiedDate = true;
          break;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }

      if (!hasOccupiedDate && onDateSelect) {
        onDateSelect(checkIn, checkOut);
      } else if (hasOccupiedDate) {
        alert('Vybraný termín obsahuje obsazené dny. Prosím vyberte jiný termín.');
        setDateRange(null);
      }
    }
  };

  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary-blue animate-spin" />
        <span className="ml-3 text-gray-600">{t('booking.loadingAvailability')}</span>
      </div>
    );
  }

  return (
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

        .react-calendar__tile--active {
          background: #2563eb !important;
          color: white !important;
        }

        .react-calendar__tile--rangeStart,
        .react-calendar__tile--rangeEnd {
          background: #2563eb !important;
          color: white !important;
        }

        .react-calendar__tile--range {
          background: #93c5fd !important;
          color: white !important;
        }

        /* Custom styles for availability */
        .available-date {
          background-color: #d1fae5;
          color: #065f46;
        }

        .available-date:enabled:hover {
          background-color: #a7f3d0 !important;
        }

        .occupied-date {
          background-color: #fee2e2;
          color: #991b1b;
          cursor: not-allowed;
          opacity: 0.6;
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

      <div className="mb-4">
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-200 border border-green-300"></div>
            <span className="text-gray-700">{t('booking.available')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-200 border border-red-300"></div>
            <span className="text-gray-700">{t('booking.occupied')}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-500 border border-blue-600"></div>
            <span className="text-gray-700">{t('booking.selected')}</span>
          </div>
        </div>
      </div>

      <Calendar
        onChange={handleDateChange}
        value={dateRange}
        selectRange={true}
        minDate={new Date()}
        tileClassName={tileClassName}
        tileDisabled={tileDisabled}
        locale={language === 'cs' ? 'cs-CZ' : 'en-US'}
        prev2Label={null}
        next2Label={null}
      />

      {dateRange && Array.isArray(dateRange) && dateRange[0] && dateRange[1] && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>{t('booking.selectedDates')}:</strong>{' '}
            {dateRange[0].toLocaleDateString(language === 'cs' ? 'cs-CZ' : 'en-US')} - {dateRange[1].toLocaleDateString(language === 'cs' ? 'cs-CZ' : 'en-US')}
          </p>
        </div>
      )}
    </div>
  );
}

