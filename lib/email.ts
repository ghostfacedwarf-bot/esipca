import nodemailer from 'nodemailer'

function getLogoUrl(language: string = 'ro'): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://metalfence.ro'
  const logoFile = language === 'ro' ? '1024.png' : '1024EN.png'
  return `${siteUrl}/images/${logoFile}`
}

interface OrderItem {
  productName: string
  variantName?: string
  quantity: number
  price: number
  attributes?: Record<string, string | number | boolean>
}

interface CustomerData {
  name: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country?: string
}

interface OrderEmailData {
  orderId: string
  customer: CustomerData
  items: OrderItem[]
  totalPrice: number
  language?: string
}

// Email translations for supported languages
const translations: Record<string, Record<string, string>> = {
  ro: {
    orderConfirmation: 'Confirmare Comandă',
    dear: 'Dragă',
    thankYou: 'Îți mulțumim pentru comandă! Am primit comanda ta și o procesăm.',
    orderNumber: 'Număr comandă',
    orderDetails: 'Detalii Comandă',
    product: 'Produs',
    qty: 'Cant.',
    price: 'Preț',
    subtotal: 'Subtotal',
    total: 'TOTAL',
    deliveryAddress: 'Adresa de Livrare',
    nextSteps: 'Următorii pași',
    nextStepsText: 'Vom verifica stocul și te vom contacta în cel mai scurt timp pentru confirmarea livrării și modalitatea de plată.',
    questions: 'Pentru întrebări, contactează-ne',
    phone: 'Telefon',
    email: 'Email',
    allRightsReserved: 'Toate drepturile rezervate',
    height: 'Înălțime',
    paint: 'Vopsea',
  },
  en: {
    orderConfirmation: 'Order Confirmation',
    dear: 'Dear',
    thankYou: 'Thank you for your order! We have received it and are processing it.',
    orderNumber: 'Order number',
    orderDetails: 'Order Details',
    product: 'Product',
    qty: 'Qty',
    price: 'Price',
    subtotal: 'Subtotal',
    total: 'TOTAL',
    deliveryAddress: 'Delivery Address',
    nextSteps: 'Next steps',
    nextStepsText: 'We will check stock availability and contact you shortly to confirm delivery and payment method.',
    questions: 'For questions, contact us',
    phone: 'Phone',
    email: 'Email',
    allRightsReserved: 'All rights reserved',
    height: 'Height',
    paint: 'Paint',
  },
  de: {
    orderConfirmation: 'Bestellbestätigung',
    dear: 'Liebe/r',
    thankYou: 'Vielen Dank für Ihre Bestellung! Wir haben sie erhalten und bearbeiten sie.',
    orderNumber: 'Bestellnummer',
    orderDetails: 'Bestelldetails',
    product: 'Produkt',
    qty: 'Menge',
    price: 'Preis',
    subtotal: 'Zwischensumme',
    total: 'GESAMT',
    deliveryAddress: 'Lieferadresse',
    nextSteps: 'Nächste Schritte',
    nextStepsText: 'Wir prüfen die Lagerverfügbarkeit und kontaktieren Sie in Kürze zur Bestätigung der Lieferung und Zahlungsmethode.',
    questions: 'Bei Fragen kontaktieren Sie uns',
    phone: 'Telefon',
    email: 'E-Mail',
    allRightsReserved: 'Alle Rechte vorbehalten',
    height: 'Höhe',
    paint: 'Farbe',
  },
  fr: {
    orderConfirmation: 'Confirmation de Commande',
    dear: 'Cher/Chère',
    thankYou: 'Merci pour votre commande! Nous l\'avons reçue et la traitons.',
    orderNumber: 'Numéro de commande',
    orderDetails: 'Détails de la Commande',
    product: 'Produit',
    qty: 'Qté',
    price: 'Prix',
    subtotal: 'Sous-total',
    total: 'TOTAL',
    deliveryAddress: 'Adresse de Livraison',
    nextSteps: 'Prochaines étapes',
    nextStepsText: 'Nous vérifierons la disponibilité du stock et vous contacterons sous peu pour confirmer la livraison et le mode de paiement.',
    questions: 'Pour toute question, contactez-nous',
    phone: 'Téléphone',
    email: 'E-mail',
    allRightsReserved: 'Tous droits réservés',
    height: 'Hauteur',
    paint: 'Peinture',
  },
  es: {
    orderConfirmation: 'Confirmación de Pedido',
    dear: 'Estimado/a',
    thankYou: '¡Gracias por tu pedido! Lo hemos recibido y lo estamos procesando.',
    orderNumber: 'Número de pedido',
    orderDetails: 'Detalles del Pedido',
    product: 'Producto',
    qty: 'Cant.',
    price: 'Precio',
    subtotal: 'Subtotal',
    total: 'TOTAL',
    deliveryAddress: 'Dirección de Entrega',
    nextSteps: 'Próximos pasos',
    nextStepsText: 'Verificaremos la disponibilidad de stock y te contactaremos pronto para confirmar la entrega y el método de pago.',
    questions: 'Para preguntas, contáctanos',
    phone: 'Teléfono',
    email: 'Correo',
    allRightsReserved: 'Todos los derechos reservados',
    height: 'Altura',
    paint: 'Pintura',
  },
  it: {
    orderConfirmation: 'Conferma Ordine',
    dear: 'Gentile',
    thankYou: 'Grazie per il tuo ordine! Lo abbiamo ricevuto e lo stiamo elaborando.',
    orderNumber: 'Numero ordine',
    orderDetails: 'Dettagli Ordine',
    product: 'Prodotto',
    qty: 'Qtà',
    price: 'Prezzo',
    subtotal: 'Subtotale',
    total: 'TOTALE',
    deliveryAddress: 'Indirizzo di Consegna',
    nextSteps: 'Prossimi passi',
    nextStepsText: 'Verificheremo la disponibilità e ti contatteremo a breve per confermare la consegna e il metodo di pagamento.',
    questions: 'Per domande, contattaci',
    phone: 'Telefono',
    email: 'Email',
    allRightsReserved: 'Tutti i diritti riservati',
    height: 'Altezza',
    paint: 'Vernice',
  },
  hu: {
    orderConfirmation: 'Rendelés Megerősítése',
    dear: 'Kedves',
    thankYou: 'Köszönjük a rendelését! Megkaptuk és feldolgozzuk.',
    orderNumber: 'Rendelési szám',
    orderDetails: 'Rendelés Részletei',
    product: 'Termék',
    qty: 'Menny.',
    price: 'Ár',
    subtotal: 'Részösszeg',
    total: 'ÖSSZESEN',
    deliveryAddress: 'Szállítási Cím',
    nextSteps: 'Következő lépések',
    nextStepsText: 'Ellenőrizzük a készletet és hamarosan felvesszük Önnel a kapcsolatot a szállítás és fizetés megerősítésére.',
    questions: 'Kérdés esetén lépjen kapcsolatba velünk',
    phone: 'Telefon',
    email: 'E-mail',
    allRightsReserved: 'Minden jog fenntartva',
    height: 'Magasság',
    paint: 'Festék',
  },
  pl: {
    orderConfirmation: 'Potwierdzenie Zamówienia',
    dear: 'Drogi/Droga',
    thankYou: 'Dziękujemy za zamówienie! Otrzymaliśmy je i przetwarzamy.',
    orderNumber: 'Numer zamówienia',
    orderDetails: 'Szczegóły Zamówienia',
    product: 'Produkt',
    qty: 'Ilość',
    price: 'Cena',
    subtotal: 'Suma częściowa',
    total: 'RAZEM',
    deliveryAddress: 'Adres Dostawy',
    nextSteps: 'Następne kroki',
    nextStepsText: 'Sprawdzimy dostępność i skontaktujemy się wkrótce w celu potwierdzenia dostawy i metody płatności.',
    questions: 'W razie pytań skontaktuj się z nami',
    phone: 'Telefon',
    email: 'E-mail',
    allRightsReserved: 'Wszelkie prawa zastrzeżone',
    height: 'Wysokość',
    paint: 'Farba',
  },
  bg: {
    orderConfirmation: 'Потвърждение на поръчка',
    dear: 'Уважаеми',
    thankYou: 'Благодарим ви за поръчката! Получихме я и я обработваме.',
    orderNumber: 'Номер на поръчка',
    orderDetails: 'Детайли на поръчката',
    product: 'Продукт',
    qty: 'К-во',
    price: 'Цена',
    subtotal: 'Междинна сума',
    total: 'ОБЩО',
    deliveryAddress: 'Адрес за доставка',
    nextSteps: 'Следващи стъпки',
    nextStepsText: 'Ще проверим наличността и ще се свържем с вас скоро за потвърждение на доставката и метода на плащане.',
    questions: 'За въпроси се свържете с нас',
    phone: 'Телефон',
    email: 'Имейл',
    allRightsReserved: 'Всички права запазени',
    height: 'Височина',
    paint: 'Боя',
  },
  nl: {
    orderConfirmation: 'Orderbevestiging',
    dear: 'Beste',
    thankYou: 'Bedankt voor je bestelling! We hebben deze ontvangen en verwerken deze.',
    orderNumber: 'Ordernummer',
    orderDetails: 'Orderdetails',
    product: 'Product',
    qty: 'Aantal',
    price: 'Prijs',
    subtotal: 'Subtotaal',
    total: 'TOTAAL',
    deliveryAddress: 'Afleveradres',
    nextSteps: 'Volgende stappen',
    nextStepsText: 'We controleren de voorraad en nemen spoedig contact met je op om levering en betaalmethode te bevestigen.',
    questions: 'Voor vragen, neem contact op',
    phone: 'Telefoon',
    email: 'E-mail',
    allRightsReserved: 'Alle rechten voorbehouden',
    height: 'Hoogte',
    paint: 'Verf',
  },
  pt: {
    orderConfirmation: 'Confirmação de Pedido',
    dear: 'Caro/a',
    thankYou: 'Obrigado pelo seu pedido! Recebemos e estamos processando.',
    orderNumber: 'Número do pedido',
    orderDetails: 'Detalhes do Pedido',
    product: 'Produto',
    qty: 'Qtd',
    price: 'Preço',
    subtotal: 'Subtotal',
    total: 'TOTAL',
    deliveryAddress: 'Endereço de Entrega',
    nextSteps: 'Próximos passos',
    nextStepsText: 'Verificaremos a disponibilidade e entraremos em contato em breve para confirmar a entrega e forma de pagamento.',
    questions: 'Para dúvidas, entre em contato',
    phone: 'Telefone',
    email: 'E-mail',
    allRightsReserved: 'Todos os direitos reservados',
    height: 'Altura',
    paint: 'Tinta',
  },
  ru: {
    orderConfirmation: 'Подтверждение заказа',
    dear: 'Уважаемый/ая',
    thankYou: 'Спасибо за заказ! Мы получили его и обрабатываем.',
    orderNumber: 'Номер заказа',
    orderDetails: 'Детали заказа',
    product: 'Товар',
    qty: 'Кол-во',
    price: 'Цена',
    subtotal: 'Подитог',
    total: 'ИТОГО',
    deliveryAddress: 'Адрес доставки',
    nextSteps: 'Следующие шаги',
    nextStepsText: 'Мы проверим наличие и свяжемся с вами в ближайшее время для подтверждения доставки и способа оплаты.',
    questions: 'По вопросам свяжитесь с нами',
    phone: 'Телефон',
    email: 'Эл. почта',
    allRightsReserved: 'Все права защищены',
    height: 'Высота',
    paint: 'Краска',
  },
}

function getTranslation(lang: string, key: string): string {
  const t = translations[lang] || translations['en'] || translations['ro']
  return t[key] || translations['ro'][key] || key
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.hostinger.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

function formatOrderItemsHtml(items: OrderItem[], lang: string): string {
  const t = (key: string) => getTranslation(lang, key)

  return items
    .map((item) => {
      const attributes = item.attributes
        ? Object.entries(item.attributes)
            .filter(([key]) => !['doubleSided'].includes(key))
            .map(([key, value]) => {
              const labels: Record<string, string> = {
                inaltime: t('height'),
                optiune_vopsea: t('paint'),
              }
              return `${labels[key] || key}: ${value}`
            })
            .join(', ')
        : ''

      return `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            <strong>${item.productName}</strong>
            ${item.variantName ? `<br><span style="color: #6b7280; font-size: 14px;">${item.variantName}</span>` : ''}
            ${attributes ? `<br><span style="color: #6b7280; font-size: 13px;">${attributes}</span>` : ''}
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${item.price.toFixed(2)} RON</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">${(item.price * item.quantity).toFixed(2)} RON</td>
        </tr>
      `
    })
    .join('')
}

function formatOrderItemsText(items: OrderItem[]): string {
  return items
    .map((item) => {
      return `- ${item.productName}${item.variantName ? ` (${item.variantName})` : ''}: ${item.quantity} x ${item.price.toFixed(2)} RON = ${(item.price * item.quantity).toFixed(2)} RON`
    })
    .join('\n')
}

export async function sendOrderConfirmationToCustomer(data: OrderEmailData): Promise<boolean> {
  const { orderId, customer, items, totalPrice, language = 'ro' } = data
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://metalfence.ro'
  const logoUrl = getLogoUrl(language)

  const t = (key: string) => getTranslation(language, key)

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <img src="${logoUrl}" alt="Esipca Metalica" style="max-height: 60px; width: auto; margin-bottom: 10px;" />
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">${t('orderConfirmation')}</p>
        </div>

        <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <p style="font-size: 16px; color: #374151;">${t('dear')} <strong>${customer.name}</strong>,</p>

          <p style="color: #374151;">${t('thankYou')}</p>

          <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #166534; font-weight: 600;">${t('orderNumber')}: ${orderId}</p>
          </div>

          <h2 style="color: #1f2937; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">${t('orderDetails')}</h2>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #f9fafb;">
                <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e5e7eb;">${t('product')}</th>
                <th style="padding: 12px; text-align: center; border-bottom: 2px solid #e5e7eb;">${t('qty')}</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">${t('price')}</th>
                <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e5e7eb;">${t('subtotal')}</th>
              </tr>
            </thead>
            <tbody>
              ${formatOrderItemsHtml(items, language)}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 15px; text-align: right; font-weight: 700; font-size: 18px;">${t('total')}:</td>
                <td style="padding: 15px; text-align: right; font-weight: 700; font-size: 18px; color: #1e40af;">${totalPrice.toFixed(2)} RON</td>
              </tr>
            </tfoot>
          </table>

          <h2 style="color: #1f2937; font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">${t('deliveryAddress')}</h2>

          <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="margin: 0; color: #374151;">
              <strong>${customer.name}</strong><br>
              ${customer.address}<br>
              ${customer.city}, ${customer.postalCode}${customer.country && customer.country !== 'RO' ? `, ${customer.country}` : ''}<br>
              ${t('phone')}: ${customer.phone}<br>
              ${t('email')}: ${customer.email}
            </p>
          </div>

          <div style="background: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              <strong>${t('nextSteps')}:</strong><br>
              ${t('nextStepsText')}
            </p>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;">

          <p style="color: #6b7280; font-size: 14px; text-align: center;">
            ${t('questions')}:<br>
            <strong>${t('phone')}:</strong> +40 (722) 292 519<br>
            <strong>${t('email')}:</strong> clienti@metalfence.ro
          </p>
        </div>

        <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px;">
          &copy; ${new Date().getFullYear()} Esipca Metalica. ${t('allRightsReserved')}.
        </p>
      </div>
    </body>
    </html>
  `

  const text = `
Esipca Metalica - ${t('orderConfirmation')}

${t('dear')} ${customer.name},

${t('thankYou')}

${t('orderNumber')}: ${orderId}

${t('orderDetails').toUpperCase()}:
${formatOrderItemsText(items)}

${t('total')}: ${totalPrice.toFixed(2)} RON

${t('deliveryAddress').toUpperCase()}:
${customer.name}
${customer.address}
${customer.city}, ${customer.postalCode}${customer.country && customer.country !== 'RO' ? `, ${customer.country}` : ''}
${t('phone')}: ${customer.phone}
${t('email')}: ${customer.email}

${t('nextSteps')}:
${t('nextStepsText')}

${t('questions')}:
${t('phone')}: +40 (722) 292 519
${t('email')}: clienti@metalfence.ro

© ${new Date().getFullYear()} Esipca Metalica
  `

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'Esipca Metalica <clienti@metalfence.ro>',
      to: customer.email,
      subject: `${t('orderConfirmation')} #${orderId} - Esipca Metalica`,
      text,
      html,
    })
    console.log(`[EMAIL] Confirmation sent to customer: ${customer.email} (lang: ${language})`)
    return true
  } catch (error) {
    console.error('[EMAIL] Failed to send customer confirmation:', error)
    return false
  }
}

export async function sendOrderNotificationToAdmin(data: OrderEmailData): Promise<boolean> {
  const { orderId, customer, items, totalPrice, language = 'ro' } = data
  const adminEmail = process.env.ORDER_NOTIFICATION_EMAIL || 'clienti@metalfence.ro'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://metalfence.ro'
  const logoUrl = getLogoUrl('ro')

  // Admin email is always in Romanian
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <img src="${logoUrl}" alt="Esipca Metalica" style="max-height: 50px; width: auto; margin-bottom: 10px;" />
          <h1 style="color: white; margin: 0; font-size: 24px;">🛒 Comandă Nouă!</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 20px;">${orderId}</p>
        </div>

        <div style="background: white; padding: 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">

          <div style="background: #dbeafe; border: 1px solid #93c5fd; border-radius: 8px; padding: 10px 15px; margin-bottom: 20px;">
            <p style="margin: 0; color: #1e40af; font-size: 14px;">
              🌐 <strong>Limba clientului:</strong> ${language.toUpperCase()}
              ${language !== 'ro' ? '(email trimis în limba clientului)' : ''}
            </p>
          </div>

          <div style="background: #ecfdf5; border: 1px solid #6ee7b7; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <h2 style="margin: 0 0 15px 0; color: #065f46; font-size: 16px;">INFORMAȚII CLIENT</h2>
            <table style="width: 100%;">
              <tr>
                <td style="padding: 5px 0; color: #6b7280; width: 100px;">Nume:</td>
                <td style="padding: 5px 0; color: #1f2937; font-weight: 600;">${customer.name}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #6b7280;">Telefon:</td>
                <td style="padding: 5px 0;"><a href="tel:${customer.phone}" style="color: #1e40af; font-weight: 600;">${customer.phone}</a></td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #6b7280;">Email:</td>
                <td style="padding: 5px 0;"><a href="mailto:${customer.email}" style="color: #1e40af;">${customer.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #6b7280;">Adresa:</td>
                <td style="padding: 5px 0; color: #1f2937;">${customer.address}, ${customer.city}, ${customer.postalCode}${customer.country && customer.country !== 'RO' ? `, ${customer.country}` : ''}</td>
              </tr>
            </table>
          </div>

          <h2 style="color: #1f2937; font-size: 16px; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">PRODUSE COMANDATE</h2>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #f9fafb;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb; font-size: 13px;">Produs</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #e5e7eb; font-size: 13px;">Cant.</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e5e7eb; font-size: 13px;">Preț/buc</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #e5e7eb; font-size: 13px;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${formatOrderItemsHtml(items, 'ro')}
            </tbody>
          </table>

          <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 20px; text-align: center;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">TOTAL COMANDĂ</p>
            <p style="margin: 10px 0 0 0; color: #1f2937; font-size: 28px; font-weight: 700;">${totalPrice.toFixed(2)} RON</p>
          </div>

          <p style="color: #6b7280; font-size: 12px; text-align: center; margin-top: 20px;">
            Comandă plasată la: ${new Date().toLocaleString('ro-RO', { timeZone: 'Europe/Bucharest' })}
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  const text = `
COMANDĂ NOUĂ - ${orderId}

LIMBA CLIENTULUI: ${language.toUpperCase()}

CLIENT:
Nume: ${customer.name}
Telefon: ${customer.phone}
Email: ${customer.email}
Adresa: ${customer.address}, ${customer.city}, ${customer.postalCode}${customer.country && customer.country !== 'RO' ? `, ${customer.country}` : ''}

PRODUSE:
${formatOrderItemsText(items)}

TOTAL: ${totalPrice.toFixed(2)} RON

Data: ${new Date().toLocaleString('ro-RO', { timeZone: 'Europe/Bucharest' })}
  `

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'Esipca Metalica <clienti@metalfence.ro>',
      to: adminEmail,
      subject: `🛒 Comandă Nouă #${orderId} - ${totalPrice.toFixed(2)} RON (${language.toUpperCase()})`,
      text,
      html,
    })
    console.log(`[EMAIL] Admin notification sent to: ${adminEmail}`)
    return true
  } catch (error) {
    console.error('[EMAIL] Failed to send admin notification:', error)
    return false
  }
}

export async function sendOrderEmails(data: OrderEmailData): Promise<{ customer: boolean; admin: boolean }> {
  const [customerResult, adminResult] = await Promise.all([
    sendOrderConfirmationToCustomer(data),
    sendOrderNotificationToAdmin(data),
  ])

  return {
    customer: customerResult,
    admin: adminResult,
  }
}

interface NewsletterSubscriber {
  email: string
  name?: string | null
}

export interface NewsletterDesignOptions {
  headerColor: string
  headerGradientEnd: string
  headerTitle: string
  showLogo: boolean
  bannerImageUrl: string
  ctaText: string
  ctaUrl: string
  ctaColor: string
}

export const NEWSLETTER_DESIGN_DEFAULTS: NewsletterDesignOptions = {
  headerColor: '#1e40af',
  headerGradientEnd: '#3b82f6',
  headerTitle: '',
  showLogo: true,
  bannerImageUrl: '',
  ctaText: '',
  ctaUrl: '',
  ctaColor: '#f59e0b',
}

export function buildNewsletterHtml(
  content: string,
  subscriberName: string | null | undefined,
  design: NewsletterDesignOptions
): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://metalfence.ro'
  const logoUrl = getLogoUrl('ro')

  const contentHtml = content
    .split('\n\n')
    .map((p) => `<p style="color: #374151; font-size: 15px; line-height: 1.7; margin: 0 0 16px 0;">${p.replace(/\n/g, '<br>')}</p>`)
    .join('')

  const logoBlock = design.showLogo
    ? `<img src="${logoUrl}" alt="Esipca Metalica" style="max-height: 60px; width: auto; margin-bottom: 10px;" />`
    : ''

  const headerTitleBlock = design.headerTitle
    ? `<h1 style="color: white; margin: 8px 0 0 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">${design.headerTitle}</h1>`
    : ''

  const bannerBlock = design.bannerImageUrl
    ? `<img src="${design.bannerImageUrl}" alt="" style="width: 100%; max-height: 250px; object-fit: cover; display: block;" />`
    : ''

  const greetingBlock = subscriberName
    ? `<p style="font-size: 16px; color: #374151; margin: 0 0 20px 0;">Buna, <strong>${subscriberName}</strong>!</p>`
    : ''

  const ctaBlock = (design.ctaText && design.ctaUrl)
    ? `<div style="text-align: center; margin: 28px 0;">
        <a href="${design.ctaUrl}" style="display: inline-block; background: ${design.ctaColor}; color: white; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 15px; letter-spacing: 0.3px;">${design.ctaText}</a>
      </div>`
    : ''

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Newsletter - Esipca Metalica</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f0f2f5; -webkit-font-smoothing: antialiased;">
  <!-- Preheader text (hidden, shows in email preview) -->
  <div style="display: none; max-height: 0; overflow: hidden;">${content.substring(0, 120).replace(/\n/g, ' ')}...</div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f2f5;">
    <tr>
      <td align="center" style="padding: 24px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

          <!-- HEADER -->
          <tr>
            <td style="background: linear-gradient(135deg, ${design.headerColor} 0%, ${design.headerGradientEnd} 100%); padding: 32px 30px; border-radius: 12px 12px 0 0; text-align: center;">
              ${logoBlock}
              ${headerTitleBlock}
            </td>
          </tr>

          <!-- BANNER IMAGE -->
          ${bannerBlock ? `<tr><td style="background: white;">${bannerBlock}</td></tr>` : ''}

          <!-- BODY -->
          <tr>
            <td style="background: white; padding: 36px 32px 20px 32px;">
              ${greetingBlock}
              ${contentHtml}
              ${ctaBlock}
            </td>
          </tr>

          <!-- DIVIDER -->
          <tr>
            <td style="background: white; padding: 0 32px;">
              <div style="border-top: 1px solid #e5e7eb;"></div>
            </td>
          </tr>

          <!-- FOOTER CONTACT -->
          <tr>
            <td style="background: white; padding: 24px 32px; text-align: center;">
              <p style="color: #6b7280; font-size: 13px; margin: 0 0 6px 0;">
                <strong>Esipca Metalica</strong> &mdash; Garduri si porti metalice de calitate
              </p>
              <p style="color: #9ca3af; font-size: 13px; margin: 0 0 4px 0;">
                +40 (722) 292 519 &bull; clienti@metalfence.ro
              </p>
              <p style="margin: 12px 0 0 0;">
                <a href="${siteUrl}" style="color: #3b82f6; font-size: 13px; text-decoration: none; font-weight: 600;">metalfence.ro</a>
              </p>
            </td>
          </tr>

          <!-- BOTTOM BAR -->
          <tr>
            <td style="background: ${design.headerColor}; padding: 16px 32px; border-radius: 0 0 12px 12px; text-align: center;">
              <p style="color: rgba(255,255,255,0.7); font-size: 11px; margin: 0;">
                &copy; ${new Date().getFullYear()} Esipca Metalica. Toate drepturile rezervate.
              </p>
              <p style="color: rgba(255,255,255,0.5); font-size: 11px; margin: 6px 0 0 0;">
                Primesti acest email pentru ca te-ai abonat la newsletter-ul nostru.
              </p>
              <p style="margin: 8px 0 0 0;">
                <a href="${siteUrl}/api/newsletter/unsubscribe?email=%%EMAIL%%" style="color: rgba(255,255,255,0.7); font-size: 11px; text-decoration: underline;">Dezabonare</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function sendNewsletter(
  subject: string,
  content: string,
  subscribers: NewsletterSubscriber[],
  design?: Partial<NewsletterDesignOptions>
): Promise<{ sent: number; failed: number; total: number }> {
  const mergedDesign: NewsletterDesignOptions = { ...NEWSLETTER_DESIGN_DEFAULTS, ...design }

  let sent = 0
  let failed = 0

  for (const subscriber of subscribers) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://metalfence.ro'
    let html = buildNewsletterHtml(content, subscriber.name, mergedDesign)
    // Replace email placeholder for unsubscribe link
    html = html.replace(/%%EMAIL%%/g, encodeURIComponent(subscriber.email))

    const text = `${subscriber.name ? `Buna, ${subscriber.name}!\n\n` : ''}${content}${mergedDesign.ctaText && mergedDesign.ctaUrl ? `\n\n${mergedDesign.ctaText}: ${mergedDesign.ctaUrl}` : ''}\n\n---\nEsipca Metalica\nTelefon: +40 (722) 292 519\nEmail: clienti@metalfence.ro\nhttps://metalfence.ro\n\nDezabonare: ${siteUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}`

    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'Esipca Metalica <clienti@metalfence.ro>',
        to: subscriber.email,
        subject: `${subject} - Esipca Metalica`,
        text,
        html,
      })
      sent++
    } catch (error) {
      console.error(`[EMAIL] Failed to send newsletter to ${subscriber.email}:`, error)
      failed++
    }
  }

  return { sent, failed, total: subscribers.length }
}

interface ContactFormData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}

export async function sendContactFormEmail(data: ContactFormData): Promise<boolean> {
  const adminEmail = process.env.ORDER_NOTIFICATION_EMAIL || 'clienti@metalfence.ro'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://metalfence.ro'
  const logoUrl = getLogoUrl('ro')

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f0f2f5;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f0f2f5;">
        <tr>
          <td align="center" style="padding: 24px 16px;">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

              <tr>
                <td style="background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%); padding: 28px 30px; border-radius: 12px 12px 0 0; text-align: center;">
                  <img src="${logoUrl}" alt="Esipca Metalica" style="max-height: 50px; width: auto; margin-bottom: 8px;" />
                  <h1 style="color: white; margin: 8px 0 0 0; font-size: 20px; font-weight: 700;">Mesaj Nou din Formular Contact</h1>
                </td>
              </tr>

              <tr>
                <td style="background: white; padding: 28px 32px;">
                  <div style="background: #f5f3ff; border: 1px solid #c4b5fd; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                    <p style="margin: 0; color: #5b21b6; font-size: 14px; font-weight: 600;">
                      ${data.subject}
                    </p>
                  </div>

                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 10px 0; color: #6b7280; font-size: 13px; width: 90px; vertical-align: top; border-bottom: 1px solid #f3f4f6;">Nume:</td>
                      <td style="padding: 10px 0; color: #1f2937; font-size: 14px; font-weight: 600; border-bottom: 1px solid #f3f4f6;">${data.name}</td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; color: #6b7280; font-size: 13px; vertical-align: top; border-bottom: 1px solid #f3f4f6;">Email:</td>
                      <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;"><a href="mailto:${data.email}" style="color: #2563eb; font-size: 14px; font-weight: 600; text-decoration: none;">${data.email}</a></td>
                    </tr>
                    <tr>
                      <td style="padding: 10px 0; color: #6b7280; font-size: 13px; vertical-align: top; border-bottom: 1px solid #f3f4f6;">Telefon:</td>
                      <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6;"><a href="tel:${data.phone}" style="color: #2563eb; font-size: 14px; font-weight: 600; text-decoration: none;">${data.phone}</a></td>
                    </tr>
                  </table>

                  <h2 style="color: #1f2937; font-size: 15px; margin: 24px 0 12px 0; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px;">Mesaj</h2>
                  <div style="background: #f9fafb; border-radius: 8px; padding: 16px;">
                    <p style="color: #374151; font-size: 14px; line-height: 1.7; margin: 0; white-space: pre-wrap;">${data.message}</p>
                  </div>

                  <div style="text-align: center; margin-top: 24px;">
                    <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject)}" style="display: inline-block; background: #7c3aed; color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px;">Raspunde la ${data.name}</a>
                  </div>
                </td>
              </tr>

              <tr>
                <td style="background: #7c3aed; padding: 14px 32px; border-radius: 0 0 12px 12px; text-align: center;">
                  <p style="color: rgba(255,255,255,0.7); font-size: 11px; margin: 0;">
                    Trimis din formularul de contact &mdash; ${siteUrl}
                  </p>
                  <p style="color: rgba(255,255,255,0.5); font-size: 11px; margin: 4px 0 0 0;">
                    ${new Date().toLocaleString('ro-RO', { timeZone: 'Europe/Bucharest' })}
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  const text = `MESAJ NOU DIN FORMULAR CONTACT

Tip: ${data.subject}

Nume: ${data.name}
Email: ${data.email}
Telefon: ${data.phone}

MESAJ:
${data.message}

---
Trimis din formularul de contact - ${siteUrl}
${new Date().toLocaleString('ro-RO', { timeZone: 'Europe/Bucharest' })}`

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'Esipca Metalica <clienti@metalfence.ro>',
      to: adminEmail,
      replyTo: data.email,
      subject: `Mesaj Contact: ${data.subject} - ${data.name}`,
      text,
      html,
    })
    console.log(`[EMAIL] Contact form email sent for: ${data.name} (${data.email})`)
    return true
  } catch (error) {
    console.error('[EMAIL] Failed to send contact form email:', error)
    return false
  }
}
