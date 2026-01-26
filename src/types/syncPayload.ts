import type {Day} from "./day.ts";
import type {Entry} from "./entry.ts";
import type {EmailSend} from "./emailSend.ts";

export type SyncPayload = Day | Entry[] | EmailSend;

export interface SyncItem {
    indexed_db_q_id: number;
    endpoint: string;
    payload: SyncPayload;
    store_name: string;
    indexed_db_id: number;
}