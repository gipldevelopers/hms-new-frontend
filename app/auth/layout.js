export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {children}
    </div>
  );
}
