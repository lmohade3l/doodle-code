import { useState } from 'react';

/** آپلود اسکن گذرنامه (فعلاً فقط پیش‌نمایش؛ آپلود واقعی تو فاز بعد) */
export function PassportScan() {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="field">
      <label>اسکن گذرنامه</label>
      <input
        type="file"
        accept="image/*,.pdf"
        onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
      />
      {fileName && <span className="scan-ok">✓ بارگذاری شد: {fileName}</span>}
    </div>
  );
}
