
export function toISO(date: Date | null | string): string | null {
    if (!date) return null
    if (typeof date === 'string') return date
    return date.toISOString()
}

export function toDateOnly(date: Date | null): string | null {
    if (!date) return null
    return date.toISOString().split('T')[0]
}

export function formatDateRu(date: Date | string | null): string {
    if (!date) return ''

    const d = typeof date === 'string' ? new Date(date) : date

    return new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(d)
}
export function isDateOverdueByDay(date: string | Date): boolean {
    const target = new Date(date)
    if (isNaN(target.getTime())) return false

    const now = new Date()

    const endOfTargetDay = new Date(
        target.getFullYear(),
        target.getMonth(),
        target.getDate(),
        23, 59, 59, 999
    )

    return endOfTargetDay.getTime() < now.getTime()
}
export function isSameDate(a: Date | string, b: Date | string) {
    const d1 = new Date(a)
    const d2 = new Date(b)

    return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
    )
}

export function formatDateTime(date: Date | string | null): string {
    if (!date) return ''

    const d = typeof date === 'string' ? new Date(date) : date

    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()

    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')

    return `${day}.${month}.${year} ${hours}:${minutes}`
}


export function parseDate(date: string | null): Date | null {
    if (!date) return null
    return new Date(date)
}