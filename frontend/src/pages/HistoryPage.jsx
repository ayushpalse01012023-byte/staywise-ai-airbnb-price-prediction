import { useEffect, useMemo, useState } from "react";

import HistoryHero from "../components/history/HistoryHero";
import HistoryStats from "../components/history/HistoryStats";
import SearchFilter from "../components/history/SearchFilter";
import PredictionHistoryTable from "../components/history/PredictionHistoryTable";

import { getPredictionHistory } from "../api/historyApi";

const DEFAULT_FILTERS = {
  search: "",
  roomType: "All Room Types",
  priceRange: "All Prices",
  dateRange: "All Time",
};

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState(DEFAULT_FILTERS.search);
  const [roomType, setRoomType] = useState(DEFAULT_FILTERS.roomType);
  const [priceRange, setPriceRange] = useState(DEFAULT_FILTERS.priceRange);
  const [dateRange, setDateRange] = useState(DEFAULT_FILTERS.dateRange);

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getPredictionHistory();
        setHistory(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  const filteredHistory = useMemo(() => {
    let records = [...history];

    // Search
    if (search.trim()) {
      const keyword = search.toLowerCase();

      records = records.filter((item) =>
        item.neighbourhood.toLowerCase().includes(keyword)
      );
    }

    // Room Type
    if (roomType !== "All Room Types") {
      records = records.filter(
        (item) => item.room_type === roomType
      );
    }

    // Price
    if (priceRange === "Below $100") {
      records = records.filter(
        (item) => item.predicted_price < 100
      );
    }

    if (priceRange === "$100 - $200") {
      records = records.filter(
        (item) =>
          item.predicted_price >= 100 &&
          item.predicted_price <= 200
      );
    }

    if (priceRange === "Above $200") {
      records = records.filter(
        (item) => item.predicted_price > 200
      );
    }

    // Date Filter
    if (dateRange !== "All Time") {
      const now = new Date();

      records = records.filter((item) => {
        const date = new Date(item.created_at);

        if (dateRange === "Today") {
          return date.toDateString() === now.toDateString();
        }

        if (dateRange === "Last 7 Days") {
          return (
            now - date <= 7 * 24 * 60 * 60 * 1000
          );
        }

        if (dateRange === "Last Month") {
          return (
            now - date <= 30 * 24 * 60 * 60 * 1000
          );
        }

        return true;
      });
    }

    return records;
  }, [
    history,
    search,
    roomType,
    priceRange,
    dateRange,
  ]);

  function handleReset() {
    setSearch(DEFAULT_FILTERS.search);
    setRoomType(DEFAULT_FILTERS.roomType);
    setPriceRange(DEFAULT_FILTERS.priceRange);
    setDateRange(DEFAULT_FILTERS.dateRange);
  }

  return (
    <>
      <HistoryHero />

      <HistoryStats history={history} />

      <SearchFilter
        search={search}
        setSearch={setSearch}
        roomType={roomType}
        setRoomType={setRoomType}
        priceRange={priceRange}
        setPriceRange={setPriceRange}
        dateRange={dateRange}
        setDateRange={setDateRange}
        historyCount={filteredHistory.length}
        onReset={handleReset}
      />

      <PredictionHistoryTable
        history={filteredHistory}
        loading={loading}
      />
    </>
  );
}

export default HistoryPage;