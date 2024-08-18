import MainLayout from "@/components/main-layout";

export default function MarketLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
