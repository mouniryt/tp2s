"use client"

import { Bot, CheckCircle2, Info, RefreshCw, AlertCircle, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface DiagnosisCardProps {
    diagnosis: string
    explanation: string[]
    onClear: () => void
}

export function DiagnosisCard({ diagnosis, explanation, onClear }: DiagnosisCardProps) {
    return (
        <div className="flex gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                <Bot className="size-4" />
            </div>

            <Card className="w-full max-w-md overflow-hidden border-none bg-gradient-to-br from-card to-muted/50 shadow-lg ring-1 ring-border">
                <CardHeader className="relative overflow-hidden pb-4">
                    <div className="absolute -right-4 -top-4 size-24 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute -left-4 -bottom-4 size-16 bg-blue-500/5 rounded-full blur-2xl" />

                    <div className="flex items-center justify-between">
                        <Badge variant="outline" className="mb-2 border-primary/20 bg-primary/5 text-primary">
                            <Sparkles className="mr-1 size-3" />
                            Expert System Result
                        </Badge>
                    </div>

                    <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
                        {diagnosis}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground flex items-center gap-1.5 pt-1">
                        <CheckCircle2 className="size-4 text-green-500" />
                        Diagnosis confirmed via forward chaining
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 pb-4">
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <Info className="size-3.5" />
                            Reasoning & Explanation
                        </h4>
                        <div className="rounded-xl border border-border/50 bg-background/50 p-3 shadow-sm backdrop-blur-sm">
                            <ul className="space-y-2">
                                {explanation.map((line, index) => (
                                    <li key={index} className="flex items-start gap-2.5 text-sm leading-snug text-foreground/80">
                                        <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary/60" />
                                        <span>{line}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-xl bg-primary/5 p-3 text-xs text-primary/80 border border-primary/10">
                        <AlertCircle className="size-4 shrink-0" />
                        <span>This diagnosis is based on an expert system engine and initial symptoms. Consult a medical professional for verification.</span>
                    </div>
                </CardContent>

                <CardFooter className="bg-muted/30 border-t border-border px-6 py-3 flex justify-end">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClear}
                        className="text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-background/80"
                    >
                        <RefreshCw className="mr-2 size-3.5" />
                        Reset Analysis
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
