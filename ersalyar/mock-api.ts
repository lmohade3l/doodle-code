// بک‌اند ساختگی. این فایل «سرویس تیم بک‌اند» حساب می‌شه: اجازه نداری تغییرش بدی.
// همه‌ی مبالغ به «ریال» هستن.
import type { Plugin } from 'vite';
import type { IncomingMessage, ServerResponse } from 'node:http';

type Status = 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';

const CITY_BASE: Record<string, number> = {
  'تهران': 450_000,
  'کرج': 520_000,
  'اصفهان': 650_000,
  'شیراز': 720_000,
  'مشهد': 780_000,
  'تبریز': 760_000,
  'اهواز': 820_000,
  'رشت': 640_000,
  'یزد': 700_000,
  'کرمان': 880_000,
};
const CITIES = Object.keys(CITY_BASE);
const PER_KG = 120_000;
const NAMES = [
  'سارا احمدی', 'علی رضایی', 'مریم کریمی', 'حسین محمدی', 'زهرا حسینی',
  'رضا نوری', 'نگار صادقی', 'امیر جعفری', 'فاطمه موسوی', 'محمدحسین عبدالرحیم‌زاده اصفهانی',
];
const STATUSES: Status[] = ['PENDING', 'IN_TRANSIT', 'IN_TRANSIT', 'DELIVERED', 'DELIVERED', 'CANCELLED'];
const HUBS = ['انبار مرکزی تهران', 'هاب کرج', 'هاب قم', 'هاب کاشان', 'هاب اصفهان', 'هاب یزد', 'هاب شیراز'];

type Event = { at: string; title: string; location: string };
type Shipment = {
  id: string;
  trackingCode: string;
  receiver: string;
  city: string;
  weightKg: number;
  cost: number;
  cod: number;
  status: Status;
  createdAt: string;
  events: Event[];
};

const NOW = Date.now();
const hoursAgo = (h: number) => new Date(NOW - h * 3_600_000).toISOString();

function buildEvents(i: number, status: Status, city: string): Event[] {
  const events: Event[] = [{ at: hoursAgo(i * 3 + 30), title: 'ثبت مرسوله', location: 'پنل فروشنده' }];
  if (status === 'PENDING') return events;
  const hops = 16 + (i % 6);
  for (let k = 0; k < hops; k++) {
    events.push({
      at: hoursAgo(i * 3 + 28 - k * 2),
      title: k % 2 === 0 ? 'ورود به هاب' : 'خروج از هاب',
      location: HUBS[k % HUBS.length],
    });
  }
  if (status === 'DELIVERED') events.push({ at: hoursAgo(i * 3), title: 'تحویل به گیرنده', location: city });
  if (status === 'CANCELLED') events.push({ at: hoursAgo(i * 3), title: 'لغو مرسوله', location: 'پنل فروشنده' });
  return events.reverse();
}

const SHIPMENTS: Shipment[] = [];
for (let i = 1; i <= 47; i++) {
  const city = CITIES[i % CITIES.length];
  const status = STATUSES[i % STATUSES.length];
  const weightKg = 1 + ((i * 3) % 9);
  SHIPMENTS.push({
    id: `sh-${i}`,
    trackingCode: `EX-${4800 + i * 7}`,
    receiver: NAMES[i % NAMES.length],
    city,
    weightKg,
    cost: CITY_BASE[city] + weightKg * PER_KG,
    cod: i % 4 === 0 ? 0 : 1_500_000 + (i % 5) * 500_000,
    status,
    createdAt: hoursAgo(i * 3 + 30),
    events: buildEvents(i, status, city),
  });
}

function send(res: ServerResponse, status: number, body: unknown, delay: number) {
  const timer = setTimeout(() => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(body));
  }, delay);
  res.on('close', () => {
    if (!res.writableEnded) clearTimeout(timer);
  });
}

function readBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk) => (raw += chunk));
    req.on('end', () => {
      try {
        resolve(JSON.parse(raw || '{}'));
      } catch {
        resolve({});
      }
    });
  });
}

const withoutEvents = ({ events: _events, ...rest }: Shipment) => rest;

export function mockApi(): Plugin {
  return {
    name: 'mock-api',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        const url = new URL(req.url ?? '/', 'http://localhost');
        const path = url.pathname;
        const method = req.method ?? 'GET';

        if (path === '/shipments' && method === 'GET') {
          const status = url.searchParams.get('status') ?? '';
          const q = url.searchParams.get('q') ?? '';
          const page = Number(url.searchParams.get('page') ?? '1');
          const pageSize = Number(url.searchParams.get('pageSize') ?? '10');
          let list = SHIPMENTS;
          if (status) list = list.filter((s) => s.status === status);
          if (q) list = list.filter((s) => s.trackingCode.toLowerCase().includes(q.toLowerCase()));
          const start = (page - 1) * pageSize;
          return send(
            res,
            200,
            {
              items: list.slice(start, start + pageSize).map(withoutEvents),
              page,
              pageSize,
              total: list.length,
              hasMore: start + pageSize < list.length,
            },
            300
          );
        }

        if (path === '/stats' && method === 'GET') {
          const counts: Record<Status, number> = { PENDING: 0, IN_TRANSIT: 0, DELIVERED: 0, CANCELLED: 0 };
          for (const s of SHIPMENTS) counts[s.status]++;
          return send(res, 200, counts, 200);
        }

        const cancelMatch = path.match(/^\/shipments\/([^/]+)\/cancel$/);
        if (cancelMatch && method === 'POST') {
          const shipment = SHIPMENTS.find((s) => s.id === cancelMatch[1]);
          if (!shipment) return send(res, 404, { message: 'مرسوله پیدا نشد' }, 300);
          if (shipment.status === 'DELIVERED' || shipment.status === 'CANCELLED') {
            return send(res, 409, { message: 'این مرسوله قابل لغو نیست' }, 600);
          }
          shipment.status = 'CANCELLED';
          shipment.events.unshift({ at: new Date().toISOString(), title: 'لغو مرسوله', location: 'پنل فروشنده' });
          return send(res, 200, withoutEvents(shipment), 600);
        }

        const detailMatch = path.match(/^\/shipments\/([^/]+)$/);
        if (detailMatch && method === 'GET') {
          const shipment = SHIPMENTS.find((s) => s.id === detailMatch[1]);
          if (!shipment) return send(res, 404, { message: 'مرسوله پیدا نشد' }, 250);
          console.log(`[api] GET /shipments/${shipment.id}`);
          return send(res, 200, shipment, 250);
        }

        if (path === '/shipments' && method === 'POST') {
          const body = await readBody(req);
          const receiver = String(body.receiver ?? '');
          const city = String(body.city ?? '');
          const weightKg = body.weightKg;
          const cod = body.cod;
          if (receiver.trim().length < 3 || !CITIES.includes(city)) {
            return send(res, 400, { message: 'اطلاعات گیرنده نامعتبر است' }, 400);
          }
          if (typeof weightKg !== 'number' || weightKg <= 0 || typeof cod !== 'number' || cod < 0) {
            return send(res, 400, { message: 'وزن یا مبلغ نامعتبر است' }, 400);
          }
          const n = SHIPMENTS.length + 1;
          const shipment: Shipment = {
            id: `sh-${n}`,
            trackingCode: `EX-${4800 + n * 7}`,
            receiver,
            city,
            weightKg,
            cost: CITY_BASE[city] + weightKg * PER_KG,
            cod,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            events: [{ at: new Date().toISOString(), title: 'ثبت مرسوله', location: 'پنل فروشنده' }],
          };
          SHIPMENTS.unshift(shipment);
          return send(res, 201, withoutEvents(shipment), 600);
        }

        next();
      });
    },
  };
}
