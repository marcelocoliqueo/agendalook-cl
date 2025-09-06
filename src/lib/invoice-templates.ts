export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerEmail: string;
  businessName: string;
  planName: string;
  planPrice: number;
  currency: string;
  paymentMethod: string;
  transactionId: string;
  status: string;
}

export function generateInvoiceHTML(data: InvoiceData): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Boleta - ${data.invoiceNumber}</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            color: #1e293b;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background: #f8fafc;
        }
        .invoice-container {
            background: white;
            border-radius: 16px;
            padding: 40px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e2e8f0;
        }
        .logo {
            font-size: 28px;
            font-weight: 700;
            color: #0ea5e9;
        }
        .invoice-number {
            text-align: right;
        }
        .invoice-number h1 {
            font-size: 24px;
            margin: 0;
            color: #1e293b;
        }
        .invoice-number p {
            margin: 5px 0 0 0;
            color: #64748b;
        }
        .customer-info {
            background: #f1f5f9;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 30px;
        }
        .customer-info h3 {
            margin: 0 0 15px 0;
            color: #1e293b;
            font-size: 18px;
        }
        .customer-info p {
            margin: 5px 0;
            color: #475569;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .items-table th {
            background: #0ea5e9;
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 600;
        }
        .items-table td {
            padding: 15px;
            border-bottom: 1px solid #e2e8f0;
        }
        .items-table tr:nth-child(even) {
            background: #f8fafc;
        }
        .total-section {
            background: #f1f5f9;
            padding: 20px;
            border-radius: 12px;
            text-align: right;
        }
        .total-amount {
            font-size: 24px;
            font-weight: 700;
            color: #0ea5e9;
            margin: 10px 0;
        }
        .payment-info {
            margin-top: 30px;
            padding: 20px;
            background: #ecfdf5;
            border-radius: 12px;
            border-left: 4px solid #10b981;
        }
        .payment-info h3 {
            margin: 0 0 10px 0;
            color: #065f46;
        }
        .payment-info p {
            margin: 5px 0;
            color: #047857;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            color: #64748b;
            font-size: 14px;
        }
        .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }
        .status-approved {
            background: #dcfce7;
            color: #166534;
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        <div class="header">
            <div class="logo">Agendalook</div>
            <div class="invoice-number">
                <h1>Boleta #${data.invoiceNumber}</h1>
                <p>Fecha: ${data.date}</p>
            </div>
        </div>

        <div class="customer-info">
            <h3>Información del Cliente</h3>
            <p><strong>Nombre:</strong> ${data.customerName}</p>
            <p><strong>Email:</strong> ${data.customerEmail}</p>
            <p><strong>Negocio:</strong> ${data.businessName}</p>
        </div>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Descripción</th>
                    <th>Plan</th>
                    <th>Precio</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Suscripción mensual a Agendalook</td>
                    <td>${data.planName}</td>
                    <td>$${data.planPrice.toLocaleString()}</td>
                </tr>
            </tbody>
        </table>

        <div class="total-section">
            <p>Total a pagar:</p>
            <div class="total-amount">$${data.planPrice.toLocaleString()} ${data.currency}</div>
        </div>

        <div class="payment-info">
            <h3>✅ Pago Confirmado</h3>
            <p><strong>Método de pago:</strong> ${data.paymentMethod}</p>
            <p><strong>ID de transacción:</strong> ${data.transactionId}</p>
            <p><strong>Estado:</strong> <span class="status-badge status-approved">${data.status}</span></p>
        </div>

        <div class="footer">
            <p>Gracias por confiar en Agendalook para gestionar tu negocio.</p>
            <p>Para soporte técnico, contacta a: soporte@agendalook.cl</p>
            <p>© 2025 Agendalook. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>
  `;
}

export function generateInvoiceNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `BL-${year}${month}${day}-${random}`;
}
