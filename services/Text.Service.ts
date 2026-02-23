import { knownSymptoms } from "../Symptoms/Text.Fileter";

export function extractSymptoms(text: string): string[] {
    const normalizedText = text.toLowerCase();

    const extracted: string[] = [];

    for (const symptom of knownSymptoms) {
        if (normalizedText.includes(symptom)) {
            extracted.push(symptom);
        }
    }

    return extracted;
}