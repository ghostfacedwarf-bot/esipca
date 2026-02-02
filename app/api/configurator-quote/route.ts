import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIp, RATE_LIMITS } from '@/lib/rate-limit'
import { z } from 'zod'
import nodemailer from 'nodemailer'

// Validation schema for the configurator quote request
const gateConfigSchema = z.object({
  type: z.enum(['batanta', 'culisanta', 'autoportanta']),
  width: z.number().min(2000).max(6000),
  integratedPedestrian: z.boolean(),
})

const configurationSchema = z.object({
  model: z.enum(['orizontal', 'vertical']),
  length: z.number().min(1).max(50),
  height: z.number().min(0.7).max(2.2),
  base: z.number().min(0).max(1.8),
  autoGates: z.number().min(0).max(3),
  autoGatesConfig: z.array(gateConfigSchema),
  pedestrianGates: z.number().min(0).max(3),
  panels: z.number().min(0).max(26),
  color: z.string().max(50),
  colorCode: z.string().max(10),
  profileRange: z.enum(['P1-P9', 'P10-P18', 'P19-P27']).optional(),
  slatWidth: z.number().min(30).max(150),
  slatGap: z.enum(['mica', 'medie', 'mare']),
})

// Profile specifications
const PROFILE_SPECS: Record<string, { widthCm: string; piecesPerMeter: number }> = {
  'P1-P9': { widthCm: '9 cm', piecesPerMeter: 10 },
  'P10-P18': { widthCm: '11.5 cm', piecesPerMeter: 8 },
  'P19-P27': { widthCm: '10 cm', piecesPerMeter: 9 },
}

const contactSchema = z.object({
  nume: z.string().min(2).max(100),
  prenume: z.string().min(2).max(100),
  email: z.string().email().max(255),
  telefon: z.string().min(10).max(20),
  judet: z.string().min(2).max(50),
  prefabricat: z.boolean(),
})

const quoteRequestSchema = z.object({
  configuration: configurationSchema,
  contact: contactSchema,
})

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request)
    const rateLimitResult = rateLimit(`configurator-quote:${clientIp}`, RATE_LIMITS.quote)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Prea multe cereri. Încercați din nou mai târziu.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          },
        }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validationResult = quoteRequestSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Date invalide', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const { configuration, contact } = validationResult.data

    // Format gate type names
    const getGateTypeName = (type: string) => {
      switch (type) {
        case 'batanta':
          return 'Batantă'
        case 'culisanta':
          return 'Culisantă'
        case 'autoportanta':
          return 'Autoportantă'
        default:
          return type
      }
    }

    // Format gap name
    const getGapName = (gap: string) => {
      switch (gap) {
        case 'mica':
          return 'Mică (8-15mm)'
        case 'medie':
          return 'Medie (15-25mm)'
        case 'mare':
          return 'Mare (25-35mm)'
        default:
          return gap
      }
    }

    // Build gates configuration text
    const gatesText = configuration.autoGatesConfig
      .map(
        (gate, i) =>
          `  Poartă ${i + 1}: ${getGateTypeName(gate.type)} - ${gate.width}mm${
            gate.integratedPedestrian ? ' (cu pietonală integrată)' : ''
          }`
      )
      .join('\n')

    // Build email content
    const emailContent = `
CERERE OFERTĂ CONFIGURATOR GARD
================================

Date Contact:
-------------
Nume: ${contact.nume} ${contact.prenume}
Email: ${contact.email}
Telefon: ${contact.telefon}
Județ: ${contact.judet}
${contact.prefabricat ? '✓ Dorește ofertă pentru stâlpi și parapet din bolțari prefabricați' : ''}

Configurație Gard:
------------------
Model: ${configuration.model === 'orizontal' ? 'Orizontal' : 'Vertical'}
Lungime totală: ${configuration.length.toFixed(2)} m
Înălțime: ${configuration.height.toFixed(2)} m
Soclu: ${configuration.base.toFixed(2)} m

Porți Auto: ${configuration.autoGates > 0 ? `${configuration.autoGates} buc` : 'Nu'}
${configuration.autoGates > 0 ? gatesText : ''}

Porți Pietonale: ${configuration.pedestrianGates > 0 ? `${configuration.pedestrianGates} buc` : 'Nu'}
Panouri: ${configuration.panels > 0 ? `${configuration.panels} buc` : 'Nu'}

Culoare: ${configuration.color || 'Nespecificată'} ${configuration.colorCode ? `(${configuration.colorCode})` : ''}
Profil: ${configuration.profileRange || 'P1-P9'} (${PROFILE_SPECS[configuration.profileRange || 'P1-P9'].widthCm})
Lățime lamelă: ${configuration.slatWidth} mm
Buc/metru liniar: ${PROFILE_SPECS[configuration.profileRange || 'P1-P9'].piecesPerMeter} buc/ml
Distanță lamele: ${getGapName(configuration.slatGap)}

================================
Cerere generată automat de configuratorul online
Data: ${new Date().toLocaleString('ro-RO', { timeZone: 'Europe/Bucharest' })}
IP: ${clientIp}
`

    // Send email if environment variables are configured
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      })

      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: process.env.QUOTE_EMAIL || process.env.SMTP_USER,
        replyTo: contact.email,
        subject: `[Configurator] Cerere ofertă - ${contact.nume} ${contact.prenume}`,
        text: emailContent,
      })
    } else {
      // Log to console in development
      console.log('=== CONFIGURATOR QUOTE REQUEST ===')
      console.log(emailContent)
      console.log('================================')
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Cererea a fost trimisă cu succes!'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Configurator quote error:', error)
    return NextResponse.json(
      { error: 'Eroare la procesarea cererii' },
      { status: 500 }
    )
  }
}
