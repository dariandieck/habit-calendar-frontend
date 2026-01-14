export type Day = {
    day: string, // PK
    created_at: string,
    how_are_you_field   ?: string,
    stress_field        ?: string,
    good_field          ?: string,
    why_good_field      ?: string,
    bad_field           ?: string,
    improve_field       ?: string,
    motivation_field: string
};

export type DayKeyFields = {
    how_are_you_field: string,
    stress_field: string,
    good_field: string,
    why_good_field: string,
    bad_field: string,
    improve_field: string
}
export const keyFieldMap: DayKeyFields = {
    how_are_you_field: "Wie geht es dir heute überhaupt?",
    stress_field: "Erlebst du gerade Stress?",
    good_field: "Was lief heute besonders gut?",
    why_good_field: "Warum lief das so gut heute?",
    bad_field: "Was lief heute nicht so gut?",
    improve_field: "Was kannst du morgen tun, um es besser zu machen?"
}