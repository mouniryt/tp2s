export type Rule = {
    id: string;
    conditions: string[];
    diagnosis: string;
};

export const rules: Rule[] = [
    {
        id: "R1",
        conditions: [
            "fever",
            "cough",
            "shortness of breath",
            "pneumonia",
            "respiratory failure"
        ],
        diagnosis: "COVID-19",
    },
    {
        id: "R2",
        conditions: [
            "shortness of breath",
            "chest tightness",
            "persistent cough",
            "wheezing",
            "difficulty breathing"
        ],
        diagnosis: "Asthma",
    },
    {
        id: "R3",
        conditions: [
            "excessive thirst",
            "frequent urination",
            "weight loss",
            "fatigue",
            "blurred vision",
            "slow healing sores",
            "frequent infections"
        ],
        diagnosis: "Diabetes",
    },
    {
        id: "R4",
        conditions: [
            "severe headache",
            "chest pain",
            "dizziness",
            "blurred vision"
        ],
        diagnosis: "Hypertension",
    },
    {
        id: "R5",
        conditions: [
            "weight loss",
            "persistent fatigue",
            "lumps",
            "skin changes",
            "chronic pain",
            "chronic cough",
            "bowel changes",
            "bladder changes"
        ],
        diagnosis: "Cancer",
    },
    {
        id: "R6",
        conditions: [
            "persistent cough",
            "mucus",
            "chest discomfort",
            "shortness of breath",
            "low grade fever",
            "fatigue"
        ],
        diagnosis: "Bronchitis",
    },
    {
        id: "R7",
        conditions: [
            "throbbing headache",
            "sensitivity to light",
            "sensitivity to sound",
            "nausea",
            "vomiting",
            "aura",
            "vision disturbances"
        ],
        diagnosis: "Migraine",
    },
    {
        id: "R8",
        conditions: [
            "watery diarrhea",
            "nausea",
            "vomiting",
            "abdominal cramps",
            "fever",
            "chills",
            "muscle aches"
        ],
        diagnosis: "Gastroenteritis",
    },
    {
        id: "R9",
        conditions: [
            "nausea",
            "vomiting",
            "diarrhea",
            "bloody diarrhea",
            "abdominal cramps",
            "fever",
            "dehydration"
        ],
        diagnosis: "Food Poisoning",
    },
    {
        id: "R10",
        conditions: [
            "joint pain",
            "joint stiffness",
            "joint swelling",
            "reduced range of motion",
            "fatigue"
        ],
        diagnosis: "Arthritis",
    },
];