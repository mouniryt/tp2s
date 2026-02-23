import { rules } from "./rules";

export function forwardChaining(patientSymptoms: string[]) {
    const explanation: string[] = [];
    console.log(patientSymptoms);
    for (const rule of rules) {
        const isSatisfied = rule.conditions.every((condition) =>
            patientSymptoms.includes(condition)
        );

        if (isSatisfied) {
            explanation.push(
                `Rule ${rule.id} was satisfied.`,
                `Conditions: ${rule.conditions.join(", ")}`
            );
            console.log(rule.diagnosis);
            console.log(explanation);
            return {
                diagnosis: rule.diagnosis,
                explanation,
            };
        }
    }

    console.log("No diagnosis found");
    return {
        diagnosis: "No diagnosis found",
        explanation: ["No rule was fully satisfied."],
    };
}