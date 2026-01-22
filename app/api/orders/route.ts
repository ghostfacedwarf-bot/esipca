import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { items, customer, totalPrice } = await request.json()

    // Validare date
    if (!customer.name || !customer.email || !customer.phone || !customer.address || !customer.city || !customer.postalCode) {
      return NextResponse.json(
        { message: 'Datele clientului sunt incomplete' },
        { status: 400 }
      )
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { message: 'Coșul este gol' },
        { status: 400 }
      )
    }

    // TODO: Salvează comanda în baza de date
    // Pentru moment, doar loghează comanda
    const order = {
      id: `ORD-${Date.now()}`,
      customer,
      items,
      totalPrice,
      status: 'pending',
      createdAt: new Date(),
    }

    console.log('📦 Comandă nouă:', order)

    // TODO: Trimite email la client și admin
    // TODO: Salvează în baza de date

    return NextResponse.json(
      {
        message: 'Comandă plasată cu succes!',
        orderId: order.id,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Eroare la crearea comenzii:', error)
    return NextResponse.json(
      { message: 'Eroare la procesarea comenzii' },
      { status: 500 }
    )
  }
}
