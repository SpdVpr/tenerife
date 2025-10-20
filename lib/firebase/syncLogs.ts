import { collection, addDoc, query, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { db } from './config';

export interface SyncLog {
  id?: string;
  timestamp: Date;
  type: 'sync' | 'import' | 'export';
  status: 'success' | 'error';
  message: string;
  details?: {
    imported?: number;
    skipped?: number;
    total?: number;
    error?: string;
    [key: string]: unknown;
  };
}

/**
 * Add a sync log entry to Firestore
 */
export async function addSyncLog(log: Omit<SyncLog, 'id'>): Promise<string> {
  try {
    const logsRef = collection(db, 'syncLogs');
    const docRef = await addDoc(logsRef, {
      ...log,
      timestamp: Timestamp.fromDate(log.timestamp),
    });
    console.log('✅ Sync log saved:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error saving sync log:', error);
    throw error;
  }
}

/**
 * Get recent sync logs from Firestore
 */
export async function getSyncLogs(maxLogs: number = 50): Promise<SyncLog[]> {
  try {
    const logsRef = collection(db, 'syncLogs');
    const q = query(logsRef, orderBy('timestamp', 'desc'), limit(maxLogs));
    const snapshot = await getDocs(q);
    
    const logs: SyncLog[] = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        timestamp: data.timestamp?.toDate() || new Date(),
        type: data.type,
        status: data.status,
        message: data.message,
        details: data.details,
      };
    });
    
    console.log(`📋 Loaded ${logs.length} sync logs`);
    return logs;
  } catch (error) {
    console.error('❌ Error loading sync logs:', error);
    return [];
  }
}

