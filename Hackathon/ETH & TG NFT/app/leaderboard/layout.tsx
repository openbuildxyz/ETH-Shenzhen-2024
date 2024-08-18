import MainLayout from "@/components/main-layout";

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
