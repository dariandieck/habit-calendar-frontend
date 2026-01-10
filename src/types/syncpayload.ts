import type {Day} from "./day.ts";
import type {Entry} from "./entry.ts";

export type SyncPayload = Day | Entry[];

export interface SyncItem {
    indexed_db_q_id: number;
    endpoint: string;
    payload: SyncPayload;
}