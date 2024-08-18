import dynamic from "next/dynamic";
import MainLayout from "@/components/main-layout";

const Home = dynamic(() => import("@/components/view/Home"), {
  ssr: false,
});
export default function HomePage() {
  return (
    <MainLayout>
      <Home />
    </MainLayout>
  );
}
