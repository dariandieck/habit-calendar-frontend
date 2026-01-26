import {getSyncQueue, removeItemFromStoreWithID} from './db.service.ts';
import { removeFromSyncQueue } from './db.service.ts';
import type {SyncItem} from "../types/syncPayload.ts";

export async function syncWithBackend(token: string) {
    const syncData: SyncItem[] = await getSyncQueue()
    let onlySuccessFull = true;
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
                if (item.endpoint.includes("/sendemail")) {
                    console.log("Successfully sent email");
                }

                // Erfolgreich gesendet → aus Queue entfernen
                await removeFromSyncQueue(item.indexed_db_q_id);
                await removeItemFromStoreWithID(item.store_name, item.indexed_db_id)
            } else {
                console.warn(
                    `Sync fehlgeschlagen für queueId ${item.indexed_db_q_id}, Status: ${res.status}`
                );
                console.warn(`item: ${JSON.stringify(item)}`);
                onlySuccessFull = false;
            }
        } catch (err) {
            console.error(
                `Sync Fehler für queueId ${item.indexed_db_q_id}:`,
                (err as Error).message
            );
            // Offline oder Netzwerkfehler → Schleife abbrechen, retry beim nächsten Online
            onlySuccessFull = false;
        }
    }
    return onlySuccessFull;
}
