// بک‌اند ساختگی. این فایل «سرویس تیم بک‌اند» حساب می‌شه: اجازه نداری تغییرش بدی.
// همه‌ی مبالغ به «ریال» هستن. تاریخ‌ها رشته‌ی YYYY-MM-DD هستن (بدون ساعت).
import type { Plugin, Connect } from 'vite';
import type { IncomingMessage, ServerResponse } from 'node:http';

// ---------- کاربرها ----------
const USERS: Record<string, { id: string; name: string; password: string }> = {
  mina: { id: 'u-1', name: 'مینا کاظمی', password: '1234' },
  reza: { id: 'u-2', name: 'رضا توکلی', password: '1234' },
};

const ACCESS_TTL_MS = 45_000; // توکن دسترسی ۴۵ ثانیه اعتبار داره

type AccessInfo = { userId: string; exp: number; family: string };
type RefreshInfo = { userId: string; used: boolean; family: string };
const accessTokens = new Map<string, AccessInfo>();
const refreshTokens = new Map<string, RefreshInfo>();
const revokedFamilies = new Set<string>();
let counter = 0;

function issuePair(userId: string, family: string) {
  counter++;
  const accessToken = `at.${userId}.${counter}.${Math.random().toString(36).slice(2, 8)}`;
  const refreshToken = `rt.${userId}.${counter}.${Math.random().toString(36).slice(2, 10)}`;
  accessTokens.set(accessToken, { userId, exp: Date.now() + ACCESS_TTL_MS, family });
  refreshTokens.set(refreshToken, { userId, used: false, family });
  return { accessToken, refreshToken };
}

// ---------- بیمه‌نامه‌ها ----------
type PolicyType = 'CAR' | 'HEALTH' | 'TRAVEL' | 'HOME';
type PolicyStatus = 'ACTIVE' | 'EXPIRED' | 'PENDING_PAYMENT';
type Installment = { n: number; dueDate: string; amount: number; paid: boolean };
type Policy = {
  id: string;
  ownerId: string;
  number: string;
  type: PolicyType;
  title: string;
  insurer: string;
  status: PolicyStatus;
  premium: number;
  startDate: string;
  endDate: string;
  installments: Installment[];
};

const TYPES: PolicyType[] = ['CAR', 'HEALTH', 'HOME', 'TRAVEL', 'CAR', 'HEALTH'];
const TITLES: Record<PolicyType, string[]> = {
  CAR: ['بدنه‌ی پژو ۲۰۶', 'شخص ثالث تیبا', 'بدنه‌ی دنا پلاس', 'شخص ثالث موتورسیکلت'],
  HEALTH: ['تکمیلی خانواده', 'درمان انفرادی', 'دندان‌پزشکی'],
  HOME: ['آتش‌سوزی آپارتمان', 'زلزله‌ی منزل مسکونی'],
  TRAVEL: ['مسافرتی شینگن', 'مسافرتی ترکیه'],
};
const INSURERS = ['بیمه‌ی ایران', 'بیمه‌ی پاسارگاد', 'بیمه‌ی سامان', 'بیمه‌ی دی', 'بیمه‌ی ما', 'بیمه‌ی کوثر'];
const STATUSES: PolicyStatus[] = ['ACTIVE', 'ACTIVE', 'PENDING_PAYMENT', 'ACTIVE', 'EXPIRED'];

const DAY = 86_400_000;
const today = new Date();
const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const addDays = (n: number) => iso(new Date(today.getTime() + n * DAY));

const POLICIES: Policy[] = [];
function seed(ownerId: string, count: number, offset: number) {
  for (let k = 1; k <= count; k++) {
    const i = k + offset;
    const type = TYPES[i % TYPES.length];
    const titles = TITLES[type];
    const status = STATUSES[i % STATUSES.length];
    const premium = (8 + (i % 7) * 3) * 1_000_000;
    const startOffset = status === 'EXPIRED' ? -400 - i : -((i * 11) % 300);
    const n = type === 'TRAVEL' ? 1 : 1 + (i % 4);
    const installments: Installment[] = [];
    for (let j = 1; j <= n; j++) {
      const due = startOffset + (j - 1) * 30;
      installments.push({
        n: j,
        dueDate: addDays(due),
        amount: Math.round(premium / n),
        paid: status === 'PENDING_PAYMENT' ? j < n : status === 'EXPIRED' || due < -10,
      });
    }
    POLICIES.push({
      id: `p-${i}`,
      ownerId,
      number: `BM-${1000 + i * 13}`,
      type,
      title: titles[i % titles.length],
      insurer: INSURERS[i % INSURERS.length],
      status,
      premium,
      startDate: addDays(startOffset),
      endDate: addDays(startOffset + 365),
      installments,
    });
  }
}
seed('u-1', 34, 0);
seed('u-2', 21, 100);

const nextDue = (p: Policy) => p.installments.find((x) => !x.paid) ?? null;
const listItem = ({ installments, ownerId: _o, ...rest }: Policy) => ({
  ...rest,
  nextDue: nextDue({ installments } as Policy),
  unpaidCount: installments.filter((x) => !x.paid).length,
});

// ---------- ابزار ----------
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

function authUser(req: IncomingMessage): { userId: string } | { error: string } {
  const header = req.headers['authorization'] ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const info = accessTokens.get(token);
  if (!info) return { error: 'INVALID_TOKEN' };
  if (revokedFamilies.has(info.family)) return { error: 'SESSION_REVOKED' };
  if (info.exp < Date.now()) return { error: 'TOKEN_EXPIRED' };
  return { userId: info.userId };
}

const log = (msg: string) => console.log(`\x1b[36m[api]\x1b[0m ${msg}`);

// ---------- مسیرها ----------
function handler(): Connect.NextHandleFunction {
  return async (req, res, next) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    const path = url.pathname;
    const method = req.method ?? 'GET';

    // --- auth ---
    if (path === '/auth/login' && method === 'POST') {
      const body = await readBody(req);
      const user = USERS[String(body.username ?? '')];
      if (!user || user.password !== body.password) {
        return send(res, 401, { message: 'نام کاربری یا رمز عبور اشتباه است' }, 400);
      }
      const family = `f${++counter}`;
      log(`login ${body.username}`);
      return send(res, 200, { ...issuePair(user.id, family), user: { id: user.id, name: user.name } }, 400);
    }

    if (path === '/auth/refresh' && method === 'POST') {
      const body = await readBody(req);
      const rt = String(body.refreshToken ?? '');
      const info = refreshTokens.get(rt);
      if (!info || revokedFamilies.has(info.family)) {
        log('refresh ✗ invalid');
        return send(res, 401, { code: 'INVALID_REFRESH' }, 150);
      }
      if (info.used) {
        // تشخیص استفاده‌ی دوباره از refresh token: به دلایل امنیتی کل نشست باطل می‌شه
        revokedFamilies.add(info.family);
        log('refresh ✗ REUSED → session revoked');
        return send(res, 401, { code: 'REFRESH_REUSED' }, 150);
      }
      info.used = true;
      log('refresh ✓');
      return send(res, 200, issuePair(info.userId, info.family), 300);
    }

    const auth = authUser(req);
    if ('error' in auth) {
      log(`${method} ${path} → 401 ${auth.error}`);
      return send(res, 401, { code: auth.error }, 100);
    }
    const userId = auth.userId;
    const mine = POLICIES.filter((p) => p.ownerId === userId);

    if (path === '/me' && method === 'GET') {
      const user = Object.values(USERS).find((u) => u.id === userId)!;
      return send(res, 200, { id: user.id, name: user.name }, 200);
    }

    // --- dashboard ---
    if (path === '/dashboard/summary' && method === 'GET') {
      const unpaid = mine.flatMap((p) => p.installments.filter((x) => !x.paid));
      return send(
        res,
        200,
        {
          active: mine.filter((p) => p.status === 'ACTIVE').length,
          pendingPayment: mine.filter((p) => p.status === 'PENDING_PAYMENT').length,
          unpaidTotal: unpaid.reduce((s, x) => s + x.amount, 0),
        },
        300
      );
    }
    if (path === '/dashboard/expiring' && method === 'GET') {
      const soon = mine
        .filter((p) => p.status !== 'EXPIRED')
        .sort((a, b) => a.endDate.localeCompare(b.endDate))
        .slice(0, 4)
        .map(listItem);
      return send(res, 200, soon, 350);
    }
    if (path === '/dashboard/notifications' && method === 'GET') {
      const items = mine
        .filter((p) => p.status === 'PENDING_PAYMENT')
        .slice(0, 3)
        .map((p) => ({ id: `n-${p.id}`, text: `قسط بیمه‌نامه‌ی ${p.number} سررسید شده است.` }));
      return send(res, 200, items, 250);
    }

    // --- policies ---
    if (path === '/policies' && method === 'GET') {
      const status = url.searchParams.get('status') ?? '';
      const q = (url.searchParams.get('q') ?? '').trim();
      const sort = url.searchParams.get('sort') ?? 'endDate';
      const page = Number(url.searchParams.get('page') ?? '1');
      const pageSize = 8;
      let list = mine;
      if (status) list = list.filter((p) => p.status === status);
      if (q) list = list.filter((p) => p.number.includes(q) || p.title.includes(q) || p.insurer.includes(q));
      list = [...list].sort((a, b) => {
        if (sort === 'premium') return b.premium - a.premium;
        const ea = a.status === 'EXPIRED' ? 1 : 0;
        const eb = b.status === 'EXPIRED' ? 1 : 0;
        return ea - eb || a.endDate.localeCompare(b.endDate);
      });
      const start = (page - 1) * pageSize;
      return send(
        res,
        200,
        {
          items: list.slice(start, start + pageSize).map(listItem),
          page,
          totalPages: Math.max(1, Math.ceil(list.length / pageSize)),
          total: list.length,
        },
        450
      );
    }

    const payMatch = path.match(/^\/policies\/([^/]+)\/installments\/(\d+)\/pay$/);
    if (payMatch && method === 'POST') {
      const policy = mine.find((p) => p.id === payMatch[1]);
      const inst = policy?.installments.find((x) => x.n === Number(payMatch[2]));
      if (!policy || !inst) return send(res, 404, { message: 'قسط پیدا نشد' }, 300);
      if (inst.paid) return send(res, 409, { message: 'این قسط قبلاً پرداخت شده' }, 300);
      inst.paid = true;
      if (policy.status === 'PENDING_PAYMENT' && policy.installments.every((x) => x.paid)) policy.status = 'ACTIVE';
      log(`pay ${policy.number} #${inst.n}`);
      return send(res, 200, { ok: true }, 700);
    }

    const detailMatch = path.match(/^\/policies\/([^/]+)$/);
    if (detailMatch && method === 'GET') {
      const policy = mine.find((p) => p.id === detailMatch[1]);
      if (!policy) return send(res, 404, { message: 'بیمه‌نامه پیدا نشد' }, 250);
      const { ownerId: _o, ...rest } = policy;
      return send(res, 200, rest, 300);
    }

    // --- travel ---
    if (path === '/travel-policies' && method === 'POST') {
      const body = await readBody(req);
      const startDate = String(body.startDate ?? '');
      const passengers = Array.isArray(body.passengers) ? body.passengers : [];
      if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || passengers.length === 0) {
        return send(res, 400, { message: 'اطلاعات سفر نامعتبر است' }, 300);
      }
      log(`travel startDate=${startDate} passengers=${passengers.length}`);
      return send(
        res,
        201,
        {
          number: `TR-${5000 + ++counter}`,
          startDate,
          destination: body.destination,
          passengers,
          premium: passengers.length * 4_500_000,
        },
        700
      );
    }

    next();
  };
}

export function mockApi(): Plugin {
  return {
    name: 'mock-api',
    configureServer(server) {
      server.middlewares.use('/api', handler());
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api', handler());
    },
  };
}
