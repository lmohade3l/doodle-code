// بک‌اند ساختگی. این فایل «سرویس تیم بک‌اند» حساب می‌شه: اجازه نداری تغییرش بدی.
import type { Plugin } from 'vite';
import type { IncomingMessage, ServerResponse } from 'node:http';

const COMPANIES = [
  'ایران', 'آسیا', 'البرز', 'دانا', 'پارسیان', 'پاسارگاد', 'سامان', 'کوثر',
  'ملت', 'ما', 'نوین', 'رازی', 'سینا', 'تعاون', 'کارآفرین', 'معلم',
];
const PLANS = ['پایه', 'نقره‌ای', 'طلایی'];
const COUNTS: Record<string, number> = { 'third-party': 23, body: 14 };
const BASE: Record<string, number> = { 'third-party': 3_600_000, body: 9_200_000 };
const EXTRA_COVERAGE_PRICE = 350_000;

type RawQuote = {
  id: string;
  type: string;
  company: string;
  plan: string;
  price: number | string;
  coverage: string;
};

const QUOTES: RawQuote[] = [];
for (const type of Object.keys(COUNTS)) {
  for (let i = 0; i < COUNTS[type]; i++) {
    const price = BASE[type] + ((i * 7919) % 23) * 85_000;
    QUOTES.push({
      id: `${type}-${i + 1}`,
      type,
      company: COMPANIES[i % COMPANIES.length],
      plan: PLANS[Math.floor(i / COMPANIES.length) % PLANS.length],
      // سرویس قدیمی قیمت‌گذاری، قیمت بعضی شرکت‌ها رو به‌صورت رشته برمی‌گردونه
      price: i % 3 === 1 ? String(price) : price,
      coverage: type === 'body' ? 'سرقت، آتش‌سوزی، تصادف' : 'خسارت مالی و جانی',
    });
  }
}

type Order = {
  id: string;
  quoteId: string;
  company: string;
  fullName: string;
  nationalCode: string;
  mobile: string;
  extraCoverage: boolean;
  total: number;
  createdAt: string;
};

const ORDERS: Order[] = [
  {
    id: 'ord-1',
    quoteId: 'third-party-1',
    company: 'ایران',
    fullName: 'سارا احمدی',
    nationalCode: '0012345678',
    mobile: '09121234567',
    extraCoverage: false,
    total: 3_600_000,
    createdAt: '2026-10-01T09:30:00.000Z',
  },
];

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

export function mockApi(): Plugin {
  return {
    name: 'mock-api',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        const url = new URL(req.url ?? '/', 'http://localhost');
        const path = url.pathname;

        if (path === '/quotes' && req.method === 'GET') {
          const type = url.searchParams.get('type') ?? 'third-party';
          const page = Number(url.searchParams.get('page') ?? '1');
          const pageSize = Number(url.searchParams.get('pageSize') ?? '6');
          const company = url.searchParams.get('company') ?? '';

          if (type === 'travel') {
            return send(res, 500, { message: 'سرویس بیمه‌ی مسافرتی در دسترس نیست' }, 400);
          }

          let list = QUOTES.filter((q) => q.type === type);
          if (company) list = list.filter((q) => q.company === company);
          const start = (page - 1) * pageSize;
          return send(
            res,
            200,
            { items: list.slice(start, start + pageSize), total: list.length, page, pageSize },
            350
          );
        }

        if (path === '/companies' && req.method === 'GET') {
          const q = (url.searchParams.get('q') ?? '').trim();
          // عبارت کوتاه‌تر، جست‌وجوی سنگین‌تر، جواب کندتر
          const delay = Math.max(150, 1400 - q.length * 450);
          return send(res, 200, q ? COMPANIES.filter((c) => c.includes(q)) : [], delay);
        }

        if (path === '/orders' && req.method === 'GET') {
          return send(res, 200, [...ORDERS].reverse(), 300);
        }

        if (path === '/orders' && req.method === 'POST') {
          const body = await readBody(req);
          const quote = QUOTES.find((q) => q.id === body.quoteId);
          const nationalCode = String(body.nationalCode ?? '');
          if (!quote) return send(res, 400, { message: 'بیمه‌نامه پیدا نشد' }, 300);
          if (!/^\d{10}$/.test(nationalCode)) {
            return send(res, 400, { message: 'کد ملی نامعتبر است' }, 300);
          }
          const order: Order = {
            id: `ord-${ORDERS.length + 1}`,
            quoteId: quote.id,
            company: quote.company,
            fullName: String(body.fullName ?? ''),
            nationalCode,
            mobile: String(body.mobile ?? ''),
            extraCoverage: Boolean(body.extraCoverage),
            total: Number(quote.price) + (body.extraCoverage ? EXTRA_COVERAGE_PRICE : 0),
            createdAt: new Date().toISOString(),
          };
          ORDERS.push(order);
          return send(res, 201, order, 800);
        }

        next();
      });
    },
  };
}
