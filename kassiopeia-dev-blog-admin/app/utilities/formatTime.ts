export function formatTime(time: Date) {
  return time.toLocaleDateString('pt-BR', {
    hour: '2-digit',
    hour12: false,
    minute: '2-digit',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}
