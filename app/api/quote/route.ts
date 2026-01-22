import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const quoteSchema = z.object({
  productId: z.string(),
  productName: z.string(),
  variantId: z.string(),
  sku: z.string(),
  quantity: z.number().min(1),
  price: z.number().min(0),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, productName, variantId, sku, quantity, price } = quoteSchema.parse(body)

    // TODO: Send email notification to admin
    // TODO: Store quote request in database
    // For now, just log it
    console.log('Quote Request:', {
      timestamp: new Date().toISOString(),
      productId,
      productName,
      variantId,
      sku,
      quantity,
      price,
      totalPrice: price * quantity,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Cererea de ofertă a fost înregistrată cu succes!',
      },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Datele introduse nu sunt valide',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    console.error('Quote API Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Eroare la procesarea cererii',
      },
      { status: 500 }
    )
  }
}
