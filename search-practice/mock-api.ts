// یه API ساختگی که روی خود dev server اجرا می‌شه.
// لازم نیست این فایل رو تغییر بدی؛ فقط بدون چطور رفتار می‌کنه (README رو ببین).
import type { Plugin } from 'vite';

const BRANDS: Record<string, string[]> = {
  'پژو': ['۲۰۶', '۲۰۷', '۴۰۵', 'پارس', '۲۰۰۸', '۵۰۸'],
  'سمند': ['LX', 'سورن', 'سورن پلاس', 'EF7'],
  'دنا': ['معمولی', 'پلاس', 'پلاس توربو'],
  'پراید': ['۱۱۱', '۱۳۱', '۱۳۲', '۱۵۱'],
  'تیبا': ['صندوق‌دار', '۲'],
  'کوییک': ['دنده‌ای', 'اتوماتیک', 'R'],
  'شاهین': ['G', 'GL', 'اتوماتیک'],
  'تارا': ['دنده‌ای', 'اتوماتیک'],
  'رانا': ['LX', 'پلاس'],
  'ساینا': ['دنده‌ای', 'S', 'اتوماتیک'],
  'هیوندای': ['النترا', 'سوناتا', 'توسان', 'سانتافه', 'اکسنت', 'i20'],
  'کیا': ['سراتو', 'اپتیما', 'اسپورتیج', 'سورنتو', 'ریو', 'پیکانتو'],
  'تویوتا': ['کرولا', 'کمری', 'راو۴', 'هایلوکس', 'یاریس', 'پرادو'],
  'رنو': ['ال۹۰', 'ساندرو', 'استپ‌وی', 'کپچر', 'داستر', 'مگان'],
  'مزدا': ['۳', '۲', '۶', 'CX-5'],
  'نیسان': ['جوک', 'قشقایی', 'ایکس‌تریل', 'تیانا', 'ماکسیما'],
  'جک': ['J4', 'S3', 'S5', 'J7'],
  'چری': ['تیگو ۵', 'تیگو ۷', 'تیگو ۸', 'آریزو ۵', 'آریزو ۶'],
  'هایما': ['S5', 'S7', '۸S', '۷X'],
  'لیفان': ['X60', 'X50', '۶۲۰', '۸۲۰'],
};

type CarModel = { id: string; brand: string; model: string; year: number; label: string };

const ALL: CarModel[] = [];
for (const [brand, models] of Object.entries(BRANDS)) {
  for (const model of models) {
    for (let year = 1380; year <= 1404; year++) {
      ALL.push({
        id: `${brand}-${model}-${year}`,
        brand,
        model,
        year,
        label: `${brand} ${model} - مدل ${year}`,
      });
    }
  }
}

export function mockApi(): Plugin {
  return {
    name: 'mock-api',
    configureServer(server) {
      server.middlewares.use('/api/models', (req, res) => {
        const url = new URL(req.url ?? '/', 'http://localhost');
        const q = (url.searchParams.get('q') ?? '').trim();

        // هر چی عبارت کوتاه‌تر، جواب کندتر. (پس «پ» دیرتر از «پژو» برمی‌گرده!)
        const delay = Math.max(200, 1800 - q.length * 400) + Math.random() * 200;

        const timer = setTimeout(() => {
          res.setHeader('Content-Type', 'application/json; charset=utf-8');

          if (q.includes('خطا') || q.toLowerCase().includes('error')) {
            res.statusCode = 500;
            res.end(JSON.stringify({ message: 'خطای سرور' }));
            return;
          }

          const items = q ? ALL.filter((m) => m.label.includes(q)) : ALL;
          res.end(JSON.stringify({ items, total: items.length }));
          console.log(`[api] q="${q}" → ${items.length} نتیجه (${Math.round(delay)}ms)`);
        }, delay);

        res.on('close', () => {
          if (!res.writableEnded) {
            clearTimeout(timer);
            console.log(`[api] q="${q}" → لغو شد (abort)`);
          }
        });
      });
    },
  };
}
