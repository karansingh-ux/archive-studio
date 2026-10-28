import type { Plugin } from 'vite';
import { GARMENTS } from '../data/garments';
import { salePrice } from '../utils/pricing';

export interface OrderRecord {
  orderId: string;
  createdAt: string;
  customer: {
    email: string;
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: Array<{
    id: string;
    garmentId: string;
    name: string;
    price: string;
    priceNumber: number;
    size: string;
    colorName: string;
    image: string;
    quantity: number;
  }>;
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  status: string;
  isDemo: boolean;
}

// In-memory ledger store for persistent demo orders during development session
const ordersLedger: Map<string, OrderRecord> = new Map();
let sessionCart: any[] = [];

export function archiveBackendPlugin(): Plugin {
  return {
    name: 'archive-backend-api',
    configureServer(server) {
      server.middlewares.use((req: any, res: any, next: any) => {
        const url = req.url?.split('?')[0];

        if (url?.startsWith('/api/') && req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        // GET /api/health
        if (url === '/api/health' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }));
          return;
        }

        // GET /api/payment-config
        if (url === '/api/payment-config' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(
            JSON.stringify({
              configured: false,
              provider: 'sandbox',
              publicKey: null,
              instructions: 'Demo checkout only. No payment is collected or receipt sent.',
            })
          );
          return;
        }

        // GET /api/cart
        if (url === '/api/cart' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 200;
          res.end(JSON.stringify({ items: sessionCart }));
          return;
        }

        // POST /api/cart
        if (url === '/api/cart' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => (body += chunk));
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              sessionCart = Array.isArray(data.items) ? data.items : [];
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify({ success: true, count: sessionCart.length }));
            } catch {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Invalid JSON body' }));
            }
          });
          return;
        }

        // POST /api/checkout
        if (url === '/api/checkout' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => (body += chunk));
          req.on('end', () => {
            try {
              const payload = JSON.parse(body);
              const { customer, items, paymentMethod = 'Credit / Debit Card' } = payload;

              if (!customer || typeof customer.email !== 'string' || !customer.email.includes('@') ||
                  !customer.fullName || !customer.address || !customer.city || !customer.postalCode || !customer.country ||
                  !Array.isArray(items) || items.length === 0) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Valid customer details and bag items are required' }));
                return;
              }

              const verifiedItems = items.map((item: any) => {
                const garment = GARMENTS.find((g) => g.id === item.garmentId);
                const quantity = Number(item.quantity);
                if (!garment || !garment.sizes.includes(item.size) || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
                  throw new Error('Invalid garment, size, or quantity');
                }
                return { id: `${garment.id}-${item.size}`, garmentId: garment.id, name: garment.name,
                  price: garment.price, priceNumber: salePrice(garment.price), size: item.size,
                  colorName: garment.colorName, image: garment.angles.front, quantity };
              });
              const subtotal = verifiedItems.reduce((acc, item) => acc + item.priceNumber * item.quantity, 0);

              const shipping = 0; // Complimentary Carbon-Neutral Express Shipping
              const total = subtotal + shipping;

              // Generate Unique Archive Order Reference: e.g. ARCHIVE-839214
              const orderId = `ARCHIVE-${Math.floor(100000 + Math.random() * 900000)}`;
              const orderRecord: OrderRecord = {
                orderId,
                createdAt: new Date().toISOString(),
                customer,
                items: verifiedItems,
                subtotal,
                shipping,
                total,
                paymentMethod: 'Demo checkout — no payment collected',
                status: 'demo',
                isDemo: true,
              };

              ordersLedger.set(orderId, orderRecord);
              sessionCart = []; // Clear backend cart session on placement

              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(
                JSON.stringify({
                  success: true,
                  orderId,
                  order: orderRecord,
                  message: 'Demo order saved for this development session. No payment was collected.',
                  livePaymentSetupRequired: true,
                })
              );
            } catch (err: any) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'Checkout processing error' }));
            }
          });
          return;
        }

        // GET /api/orders/:id
        if (url?.startsWith('/api/orders/') && req.method === 'GET') {
          const id = url.replace('/api/orders/', '');
          const order = ordersLedger.get(id);
          res.setHeader('Content-Type', 'application/json');
          if (order) {
            res.statusCode = 200;
            res.end(JSON.stringify({ success: true, order }));
          } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'Order not found' }));
          }
          return;
        }

        next();
      });
    },
  };
}
