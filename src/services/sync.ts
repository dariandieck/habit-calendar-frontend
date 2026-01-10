import {clearAllData, getSyncQueue} from './db';
import { removeFromSyncQueue } from './db';
import type {SyncItem} from "../types/syncpayload.ts";


/**
 * Läuft idealerweise beim Online-Event:
 * - holt alle Queue-Items
 * - schickt sie ans Backend
 * - entfernt erfolgreich gesendete Items
 */
export async function syncWithBackend() {
    const syncData: SyncItem[] = await getSyncQueue()
    let performed = false;

    console.log("Trying to Sync the following data with Backend")
    console.log(syncData);
    for (const item of syncData) {
        try {
            const res = await fetch(item.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item.payload),
            });

            if (res.ok) {
                // Erfolgreich gesendet → aus Queue entfernen
                await removeFromSyncQueue(item.indexed_db_q_id);
                // And here at least one item was synced to the backend, so it was "performed"
                performed = true;
            } else {
                console.warn(
                    `Sync fehlgeschlagen für queueId ${item.indexed_db_q_id}, Status: ${res.status}`
                );
                console.warn(`item: ${JSON.stringify(item)}`);
                // Breche Schleife ab, damit wir es später nochmal versuchen
                break;
            }
        } catch (err) {
            console.error(
                `Sync Fehler für queueId ${item.indexed_db_q_id}:`,
                (err as Error).message
            );
            // Offline oder Netzwerkfehler → Schleife abbrechen, retry beim nächsten Online
            break;
        }
    }

    if (performed) {
        await clearAllData();
        window.location.reload();
    }
    return performed;
}
