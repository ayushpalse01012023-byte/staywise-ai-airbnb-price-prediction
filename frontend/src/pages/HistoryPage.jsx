import HistoryHero from "../components/history/HistoryHero";
import HistoryStats from "../components/history/HistoryStats";
import SearchFilter from "../components/history/SearchFilter";
import PredictionHistoryTable from "../components/history/PredictionHistoryTable";

function HistoryPage() {
  return (
    <>
      <HistoryHero />
      <HistoryStats />
      <SearchFilter />
      <PredictionHistoryTable />
    </>
  );
}

export default HistoryPage;