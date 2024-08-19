import Header from "@/app/_components/Header";
import Main from "./_components/Main";
import TransactionsSection from "./_components/TransactionsSection";
import StakingSection from "./_components/StakingSection";

export default function Home() {
  return (
    <>
      <Header />
      <Main />
      <StakingSection />
      <TransactionsSection />
    </>
  );
}
