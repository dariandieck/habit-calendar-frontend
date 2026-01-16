import {clearAllData, getSyncQueue} from './db.service.ts';
import { removeFromSyncQueue } from './db.service.ts';
import type {SyncItem} from "../types/syncpayload.ts";

export async function syncWithBackend(token: string) {
    const syncData: SyncItem[] = await getSyncQueue()
    let performed = false;

    if(syncData.length > 0) {
        console.log("Trying to Sync the following data with Backend")
        console.log(syncData);
    }
    for (const item of syncData) {
        try {
            const res = await fetch(item.endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
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
    }
    return performed;
}
