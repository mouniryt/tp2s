"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { Bot, Stethoscope, Search, Check, AlertCircle } from "lucide-react"
import { extractSymptoms } from "@/services/Text.Service"
import { forwardChaining } from "@/lib/engine"
import { DiagnosisCard } from "./diagnosis-card"
import Link from "next/link"
import { Button } from "./ui/button"
import { knownSymptoms } from "@/Symptoms/Text.Fileter"
import { Checkbox } from "./ui/checkbox"
import { ScrollArea } from "./ui/scroll-area"

export function ChatPanel() {
  const [input, setInput] = useState("")
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [diagnosis, setDiagnosis] = useState<{ diagnosis: string; explanation: string[] } | null>(null)
  const [showSymptomPicker, setShowSymptomPicker] = useState(false)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const isLoading = status === "streaming" || status === "submitted"

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const runDiagnosis = (currentSymptoms: string[]) => {
    const result = forwardChaining(currentSymptoms)
    if (result.diagnosis !== "No diagnosis found") {
      setDiagnosis(result)
    } else {
      setDiagnosis(null)
    }
  }

  const handleSubmit = () => {
    if (!input.trim() || isLoading) return

    // Extract symptoms from the input
    const detectedSymptoms = extractSymptoms(input)

    if (detectedSymptoms.length > 0) {
      const updatedSymptoms = Array.from(new Set([...symptoms, ...detectedSymptoms]))
      setSymptoms(updatedSymptoms)
      runDiagnosis(updatedSymptoms)
      setShowSymptomPicker(false)
    } else {
      // No symptoms detected, show the picker
      setShowSymptomPicker(true)
      setSelectedSymptoms([])
    }

    sendMessage({ text: input })
    setInput("")
  }

  const handleManualSymptomSubmit = () => {
    if (selectedSymptoms.length === 0) return

    const updatedSymptoms = Array.from(new Set([...symptoms, ...selectedSymptoms]))
    setSymptoms(updatedSymptoms)
    runDiagnosis(updatedSymptoms)
    setShowSymptomPicker(false)
    setSelectedSymptoms([])

    // Smooth scroll to results
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    )
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Bot className="size-5" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">AI Assistant</h1>
            <p className="text-xs text-muted-foreground">
              {isLoading ? "Thinking..." : "Online"}
            </p>
          </div>
        </div>
        <Link href="/doctor">
          <Button variant="outline" size="sm" className="gap-2">
            <Stethoscope className="size-4" />
            Doctor Portal
          </Button>
        </Link>
      </header>

      {/* Symptoms Display */}
      {symptoms.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/30 px-6 py-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Known Symptoms:
          </span>
          <div className="flex flex-wrap gap-2">
            {symptoms.map((symptom) => (
              <span
                key={symptom}
                className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary animate-in zoom-in-95 duration-300"
              >
                {symptom}
              </span>
            ))}
            <button
              onClick={() => {
                setSymptoms([])
                setDiagnosis(null)
              }}
              className="text-xs text-muted-foreground hover:text-foreground underline ml-2"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Messages area */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex h-full min-h-[60vh] flex-col items-center justify-center text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-secondary">
                <Bot className="size-8 text-muted-foreground" />
              </div>
              <h2 className="mt-4 text-lg font-semibold text-foreground">
                How can I help you today?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Ask me about your symptoms. I can help identify potential illnesses.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading &&
                messages[messages.length - 1]?.role === "user" && (
                  <div className="flex gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                      <Bot className="size-4" />
                    </div>
                    <div className="flex items-center gap-1 rounded-2xl border border-border bg-card px-4 py-3">
                      <span className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                      <span className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                      <span className="size-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                    </div>
                  </div>
                )}

              {/* Symptom Picker UI */}
              {showSymptomPicker && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <AlertCircle className="size-4" />
                    </div>
                    <div className="flex-1 bg-card rounded-2xl border border-border overflow-hidden">
                      <div className="px-6 py-4 border-b">
                        <h3 className="text-sm font-semibold">I couldn't identify any symptoms.</h3>
                        <p className="text-xs text-muted-foreground mt-1">Please select the symptoms you are experiencing from the list below:</p>
                      </div>
                      <ScrollArea className="h-64 px-6 py-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 py-4">
                          {knownSymptoms.map((symptom) => (
                            <div key={symptom} className="flex items-center space-x-2 group">
                              <Checkbox
                                id={`symptom-${symptom}`}
                                checked={selectedSymptoms.includes(symptom)}
                                onCheckedChange={() => toggleSymptom(symptom)}
                              />
                              <label
                                htmlFor={`symptom-${symptom}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer group-hover:text-primary transition-colors"
                              >
                                {symptom}
                              </label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                      <div className="px-6 py-4 bg-muted/30 flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          {selectedSymptoms.length} symptom{selectedSymptoms.length !== 1 ? 's' : ''} selected
                        </span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => setShowSymptomPicker(false)}>
                            Dismiss
                          </Button>
                          <Button
                            size="sm"
                            className="gap-2"
                            disabled={selectedSymptoms.length === 0}
                            onClick={handleManualSymptomSubmit}
                          >
                            <Check className="size-4" />
                            Finalize Selection
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {diagnosis && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <DiagnosisCard
                    diagnosis={diagnosis.diagnosis}
                    explanation={diagnosis.explanation}
                    onClear={() => {
                      setDiagnosis(null)
                      setSymptoms([])
                    }}
                  />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </main>

      {/* Input area */}
      <ChatInput
        input={input}
        onInputChange={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  )
}
