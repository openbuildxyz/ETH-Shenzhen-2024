import MainLayout from "@/components/main-layout";

export default function MintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
