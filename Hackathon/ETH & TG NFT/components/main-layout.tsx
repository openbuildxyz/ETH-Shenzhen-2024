export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full pt-6 px-4 mb-[20px] min-h-screen">{children}</div>
  );
}
