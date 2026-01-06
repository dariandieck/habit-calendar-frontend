import { openDB, type IDBPDatabase } from 'idb';
import type {Habit} from '../types/habit';
import type {Entry} from "../types/entry.ts";
import type {Day} from "../types/day.ts";
import type { SyncPayload, SyncItem} from "../types/syncpayload.ts";
import {BASE_URL} from "./api.ts";

const DB_NAME = 'daily-calendar';
const DB_VERSION = 3;
const DAY_STORE = 'days';
const ENTRY_STORE = 'entries';
const SYNC_STORE = 'syncQueue';

// --- IndexedDB Initialisierung ---
let dbPromise: Promise<IDBPDatabase>;

function getDB() {
    if (!dbPromise) {
        dbPromise = openDB(DB_NAME, DB_VERSION, {
            upgrade(db) {
                // Days Store
                if (!db.objectStoreNames.contains(DAY_STORE)) {
                    db.createObjectStore(DAY_STORE, {
                        keyPath: 'd_id',
                        autoIncrement: true,
                    });
                }

                // Entries Store
                if (!db.objectStoreNames.contains(ENTRY_STORE)) {
                    db.createObjectStore(ENTRY_STORE, {
                        keyPath: 'e_id',
                        autoIncrement: true,
                    });
                }

                // Sync Queue Store (Payloads, die noch ans Backend müssen)
                if (!db.objectStoreNames.contains(SYNC_STORE)) {
                    db.createObjectStore(SYNC_STORE, {
                        keyPath: 'q_id',
                        autoIncrement: true,
                    });
                }
            },
        });
    }
    return dbPromise;
}

// ---------------------------
// --- Habits Funktionen ---
// ---------------------------

// Alle lokalen Days holen
export async function getLocalDays(): Promise<Habit[]> {
    const db = await getDB();
    return db.getAll(DAY_STORE);
}

// Alle lokalen Entries holen
export async function getLocalEntries(): Promise<Habit[]> {
    const db = await getDB();
    return db.getAll(ENTRY_STORE);
}

// Offline speichern
export async function trySaveEntriesLocalAndSyncLaterOn(entries: Entry[]): Promise<void> {
    const db = await getDB();
    const tx = db.transaction(ENTRY_STORE, 'readwrite');
    entries.forEach(entry => tx.store.put(entry));
    await tx.done;

    await addToSyncQueue("/entries", entries)
}

export async function trySaveDayLocalAndSyncLaterOn(day: Day): Promise<void> {
    const db = await getDB();
    const tx = db.transaction(DAY_STORE, 'readwrite');
    tx.store.put(day)
    await tx.done;

    await addToSyncQueue("/days", day)
}

// ---------------------------
// --- Sync Queue Funktionen ---
// ---------------------------

// Payload zur Sync Queue hinzufügen
export async function addToSyncQueue(endpoint: string, payload: SyncPayload) {
    const db = await getDB();
    const tx = db.transaction(SYNC_STORE, 'readwrite');
    await tx.store.add({
        endpoint: BASE_URL + endpoint,
        payload: payload
    });
    await tx.done;
}

// Alle Items aus der Sync Queue holen
export async function getSyncQueue(): Promise<SyncItem[]> {
    const db = await getDB();
    return db.getAll(SYNC_STORE);
}

// Einzelnes Item aus der Sync Queue löschen
export async function removeFromSyncQueue(q_id: number) {
    const db = await getDB();
    const tx = db.transaction(SYNC_STORE, 'readwrite');
    await tx.store.delete(q_id);
    await tx.done;
}

// ---------------------------
// --- Utility Funktionen ---
// ---------------------------

// Alle Daten löschen (für Debug / Reset)
export async function clearAllData() {
    const db = await getDB();

    const tx1 = db.transaction(DAY_STORE, 'readwrite');
    await tx1.store.clear();
    await tx1.done;

    const tx2 = db.transaction(ENTRY_STORE, 'readwrite');
    await tx2.store.clear();
    await tx2.done;

    const tx3 = db.transaction(SYNC_STORE, 'readwrite');
    await tx3.store.clear();
    await tx3.done;
}

