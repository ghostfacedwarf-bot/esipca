import type { Metadata } from 'next'
import TrackOrderClient from './TrackOrderClient'

export const metadata: Metadata = {
  title: 'Urmarire Comanda',
  description: 'Urmareste statusul comenzii tale. Introdu numarul comenzii si adresa de email pentru a vedea detaliile.',
}

export default function TrackPage() {
  return <TrackOrderClient />
}
