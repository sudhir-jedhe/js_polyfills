// app/api/generate-invoice/route.ts
// Node.js Runtime (default -- no `runtime` export needed): required
// here because of a native-binding PDF library and filesystem access.

// `runtime` intentionally omitted -- defaults to 'nodejs'
import { writeFile } from 'fs/promises';
import path from 'path';
import PDFDocument from 'pdfkit'; // relies on Node-native buffer/stream APIs

export async function POST(request: Request) {
  const { orderId, lineItems } = await request.json();

  const doc = new PDFDocument();
  const outputPath = path.join('/tmp', `invoice-${orderId}.pdf`);

  const chunks: Buffer[] = [];
  doc.on('data', (chunk) => chunks.push(chunk));

  doc.fontSize(18).text(`Invoice #${orderId}`);
  lineItems.forEach((item: { name: string; price: number }) => {
    doc.fontSize(12).text(`${item.name}: $${item.price.toFixed(2)}`);
  });
  doc.end();

  const pdfBuffer = await new Promise<Buffer>((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
  });

  await writeFile(outputPath, pdfBuffer);

  return new Response(pdfBuffer, {
    headers: { 'Content-Type': 'application/pdf' },
  });
}
