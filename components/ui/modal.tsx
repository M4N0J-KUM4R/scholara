"use client"

import type { ReactNode } from "react"
import { Button } from "./button"

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div
        className="nb-shadow-lg w-full max-w-lg border-2 border-ink bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b-2 border-ink bg-sun px-4 py-3">
          <h3 className="font-display text-[14px] text-ink">{title}</h3>
          <Button variant="outline" size="sm" onClick={onClose} aria-label="Close">
            ✕
          </Button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-4">{children}</div>
        {footer ? <div className="flex justify-end gap-2 border-t-2 border-ink bg-paper px-4 py-3">{footer}</div> : null}
      </div>
    </div>
  )
}
