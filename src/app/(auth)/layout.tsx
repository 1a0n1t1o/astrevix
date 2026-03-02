export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-8"
      style={{
        backgroundColor: "#FAFBFC",
        backgroundImage:
          "radial-gradient(at 20% 20%, rgba(37,99,235,0.07) 0%, transparent 50%), radial-gradient(at 80% 80%, rgba(124,58,237,0.05) 0%, transparent 50%)",
      }}
    >
      <div className="w-full max-w-[420px]">{children}</div>
    </div>
  );
}
