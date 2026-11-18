import { useEffect, useRef, useState } from 'react'
import { t } from '../i18n'

export function useCopyCommand(command: string) {
  const [status, setStatus] = useState<'idle' | 'ok' | 'fail'>('idle')
  const reset = useRef<number>(undefined)

  useEffect(() => () => window.clearTimeout(reset.current), [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setStatus('ok')
    } catch {
      setStatus('fail')
    }
    window.clearTimeout(reset.current)
    reset.current = window.setTimeout(() => setStatus('idle'), 1800)
  }

  const label = status === 'ok' ? t.install.copied : status === 'fail' ? t.start.copyFail : t.install.copy
  return { status, copy, label }
}

export function CopyCommand({ command }: { command: string }) {
  const { copy, label } = useCopyCommand(command)
  return (
    <div className="copy-command">
      <code>{command}</code>
      <button type="button" onClick={copy} aria-live="polite">{label}</button>
    </div>
  )
}
