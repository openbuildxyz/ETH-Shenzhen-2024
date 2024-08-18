import MainLayout from "@/components/main-layout";

export default function FriendsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
