import HistoryHero from "../components/history/HistoryHero";
import HistoryStats from "../components/history/HistoryStats";
import SearchFilter from "../components/history/SearchFilter";

function HistoryPage() {
  return (
    <>
      <HistoryHero />
      <HistoryStats />
      <SearchFilter />
    </>
  );
}

export default HistoryPage;