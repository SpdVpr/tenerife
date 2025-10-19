/**
 * iCal (ICS) Calendar Integration
 * Handles export and import of bookings in iCalendar format for Booking.com sync
 */

export interface ICalEvent {
  uid: string;
  summary: string;
  description?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  status: 'CONFIRMED' | 'TENTATIVE' | 'CANCELLED';
  created?: Date;
  lastModified?: Date;
}

/**
 * Generate iCal (.ics) content from booking events
 * This format is compatible with Booking.com calendar sync
 */
export function generateICalContent(events: ICalEvent[]): string {
  const lines: string[] = [];
  
  // iCal header
  lines.push('BEGIN:VCALENDAR');
  lines.push('VERSION:2.0');
  lines.push('PRODID:-//Cielo Dorado Tenerife//Booking Calendar//EN');
  lines.push('CALSCALE:GREGORIAN');
  lines.push('METHOD:PUBLISH');
  lines.push('X-WR-CALNAME:Cielo Dorado - Reservations');
  lines.push('X-WR-TIMEZONE:Atlantic/Canary');
  lines.push('X-WR-CALDESC:Cielo Dorado Tenerife - Blocked dates');

  // Add each event
  for (const event of events) {
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${event.uid}@cielodorado-tenerife.eu`);
    lines.push(`DTSTAMP:${formatICalDateTime(new Date())}`);
    lines.push(`DTSTART;VALUE=DATE:${formatICalDate(event.startDate)}`);
    lines.push(`DTEND;VALUE=DATE:${formatICalDate(event.endDate)}`);
    lines.push(`SUMMARY:${escapeICalText(event.summary)}`);
    
    if (event.description) {
      lines.push(`DESCRIPTION:${escapeICalText(event.description)}`);
    }
    
    lines.push(`STATUS:${event.status}`);
    lines.push('TRANSP:OPAQUE'); // Mark as busy/blocked
    
    if (event.created) {
      lines.push(`CREATED:${formatICalDateTime(event.created)}`);
    }
    
    if (event.lastModified) {
      lines.push(`LAST-MODIFIED:${formatICalDateTime(event.lastModified)}`);
    }
    
    lines.push('END:VEVENT');
  }

  // iCal footer
  lines.push('END:VCALENDAR');

  return lines.join('\r\n');
}

/**
 * Parse iCal content and extract booking events
 * Used to import bookings from Booking.com calendar
 */
export function parseICalContent(icalContent: string): ICalEvent[] {
  const events: ICalEvent[] = [];
  const lines = icalContent.split(/\r?\n/);
  
  let currentEvent: Partial<ICalEvent> | null = null;
  let currentProperty = '';
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    
    // Handle line folding (continuation lines start with space or tab)
    while (i + 1 < lines.length && /^[ \t]/.test(lines[i + 1])) {
      i++;
      line += lines[i].trim();
    }
    
    if (line === 'BEGIN:VEVENT') {
      currentEvent = {};
    } else if (line === 'END:VEVENT' && currentEvent) {
      // Validate and add event
      if (currentEvent.uid && currentEvent.startDate && currentEvent.endDate) {
        events.push({
          uid: currentEvent.uid,
          summary: currentEvent.summary || 'Blocked',
          description: currentEvent.description,
          startDate: currentEvent.startDate,
          endDate: currentEvent.endDate,
          status: currentEvent.status || 'CONFIRMED',
          created: currentEvent.created,
          lastModified: currentEvent.lastModified,
        });
      }
      currentEvent = null;
    } else if (currentEvent && line.includes(':')) {
      const colonIndex = line.indexOf(':');
      const property = line.substring(0, colonIndex);
      const value = line.substring(colonIndex + 1);
      
      // Parse property (may include parameters like DTSTART;VALUE=DATE)
      const [propName] = property.split(';');
      
      switch (propName) {
        case 'UID':
          currentEvent.uid = value.replace(/@.*$/, ''); // Remove domain part
          break;
        case 'SUMMARY':
          currentEvent.summary = unescapeICalText(value);
          break;
        case 'DESCRIPTION':
          currentEvent.description = unescapeICalText(value);
          break;
        case 'DTSTART':
          currentEvent.startDate = parseICalDate(value);
          break;
        case 'DTEND':
          currentEvent.endDate = parseICalDate(value);
          break;
        case 'STATUS':
          if (value === 'CONFIRMED' || value === 'TENTATIVE' || value === 'CANCELLED') {
            currentEvent.status = value;
          }
          break;
        case 'CREATED':
          currentEvent.created = parseICalDateTime(value);
          break;
        case 'LAST-MODIFIED':
          currentEvent.lastModified = parseICalDateTime(value);
          break;
      }
    }
  }
  
  return events;
}

/**
 * Format date as iCal DATE format: YYYYMMDD
 */
function formatICalDate(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Format date as iCal DATETIME format: YYYYMMDDTHHmmssZ
 */
function formatICalDateTime(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

/**
 * Parse iCal DATE format to YYYY-MM-DD
 */
function parseICalDate(value: string): string {
  // Remove any time component if present
  const dateOnly = value.split('T')[0];
  
  // Parse YYYYMMDD format
  if (dateOnly.length === 8) {
    const year = dateOnly.substring(0, 4);
    const month = dateOnly.substring(4, 6);
    const day = dateOnly.substring(6, 8);
    return `${year}-${month}-${day}`;
  }
  
  return dateOnly;
}

/**
 * Parse iCal DATETIME format to Date object
 */
function parseICalDateTime(value: string): Date {
  // Handle format: YYYYMMDDTHHmmssZ or YYYYMMDD
  const dateOnly = value.split('T')[0];
  
  if (dateOnly.length === 8) {
    const year = parseInt(dateOnly.substring(0, 4));
    const month = parseInt(dateOnly.substring(4, 6)) - 1;
    const day = parseInt(dateOnly.substring(6, 8));
    
    if (value.includes('T')) {
      const timeStr = value.split('T')[1].replace('Z', '');
      const hours = parseInt(timeStr.substring(0, 2));
      const minutes = parseInt(timeStr.substring(2, 4));
      const seconds = parseInt(timeStr.substring(4, 6));
      
      return new Date(Date.UTC(year, month, day, hours, minutes, seconds));
    }
    
    return new Date(year, month, day);
  }
  
  return new Date(value);
}

/**
 * Escape special characters in iCal text fields
 */
function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
}

/**
 * Unescape special characters in iCal text fields
 */
function unescapeICalText(text: string): string {
  return text
    .replace(/\\n/g, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\');
}

/**
 * Convert Firebase booking to iCal event
 */
export function bookingToICalEvent(booking: {
  id: string;
  checkIn: string;
  checkOut: string;
  firstName?: string;
  lastName?: string;
  status: string;
  createdAt?: Date;
}): ICalEvent {
  // Add 1 day to checkout for cleaning day
  const checkOutDate = new Date(booking.checkOut);
  checkOutDate.setDate(checkOutDate.getDate() + 1);
  const checkOutWithCleaning = checkOutDate.toISOString().split('T')[0];
  
  return {
    uid: booking.id,
    summary: 'Blocked',
    description: 'Property is not available',
    startDate: booking.checkIn,
    endDate: checkOutWithCleaning,
    status: booking.status === 'confirmed' ? 'CONFIRMED' : 'TENTATIVE',
    created: booking.createdAt,
    lastModified: new Date(),
  };
}

/**
 * Get all dates between start and end (inclusive)
 */
export function getDatesBetween(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);
  const end = new Date(endDate);
  
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

