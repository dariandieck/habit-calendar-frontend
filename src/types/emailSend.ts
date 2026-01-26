import type {Day} from "./day.ts";
import type {Entry} from "./entry.ts";

export type EmailSend = {
    day: Day,
    entries: Entry[]
}