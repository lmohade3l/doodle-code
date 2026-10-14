export function Footer() {
  return (
    <footer className="footer">
      <span>پشتیبانی: {import.meta.env.SUPPORT_PHONE}</span>
      <span className="muted">نسخه‌ی {import.meta.env.VITE_APP_VERSION}</span>
    </footer>
  );
}
