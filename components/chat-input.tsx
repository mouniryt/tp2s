"use client"

import { ArrowUp } from "lucide-react"

interface ChatInputProps {
  input: string
  onInputChange: (value: string) => void
  onSubmit: () => void
  isLoading: boolean
}

export function ChatInput({
  input,
  onInputChange,
  onSubmit,
  isLoading,
}: ChatInputProps) {
  return (
    <div className="border-t border-border bg-card p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
        className="mx-auto flex max-w-3xl items-end gap-3"
      >
        <div className="relative flex-1">
          <textarea
            value={input}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                onSubmit()
              }
            }}
            placeholder="Type your message..."
            disabled={isLoading}
            rows={1}
            className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute bottom-2 right-2 flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-80 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <ArrowUp className="size-4" />
          </button>
        </div>
      </form>
    </div>
  )
}
