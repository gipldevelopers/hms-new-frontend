"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Search, CheckCircle2, Circle, Loader2 } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("authtoken");
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

export function TestSelection({ selectedTests, toggleTest }) {
  const [activeCategory, setActiveCategory] = useState("All Tests");
  const [searchQuery, setSearchQuery] = useState("");
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    async function fetchTests() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_BASE}/laboratory/tests?search=${encodeURIComponent(searchQuery.trim())}`, {
          headers: getAuthHeaders(),
        });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.message || "Failed to fetch lab tests");
        if (alive) setTests(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        if (alive) {
          setTests([]);
          setError(err.message);
        }
      } finally {
        if (alive) setLoading(false);
      }
    }
    const timer = setTimeout(fetchTests, 250);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [searchQuery]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(tests.map((test) => test.category).filter(Boolean)));
    return ["All Tests", ...unique];
  }, [tests]);

  const visibleTests = activeCategory === "All Tests"
    ? tests
    : tests.filter((test) => test.category === activeCategory);

  return (
    <div className="bg-card text-card-foreground p-5 rounded-lg border border-border space-y-4 shadow-none">
      <div className="flex items-center gap-2">
        <h2 className="text-[15px] font-bold text-foreground">Test Selection</h2>
        {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
      </div>

      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground opacity-50" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tests, panels, or codes..."
          className="w-full h-11 pl-10 pr-4 bg-background border border-border rounded-lg text-[13px] font-bold text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary transition-all shadow-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-2">
        <div className="md:col-span-3 flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-1.5 pb-2 md:pb-0 border-b md:border-b-0 md:border-r border-border no-scrollbar select-none">
          {categories.map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2.5 rounded-lg text-[12px] font-bold text-left transition-all cursor-pointer whitespace-nowrap md:whitespace-normal ${
                  isActive ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="md:col-span-9 space-y-3 max-h-[380px] overflow-y-auto pr-1 no-scrollbar">
          {error && (
            <div className="p-4 border border-destructive/20 bg-destructive/5 rounded-lg text-[12px] font-bold text-destructive">
              {error}
            </div>
          )}
          {!loading && !error && visibleTests.length === 0 && (
            <div className="p-6 border border-border bg-background/30 rounded-lg text-center text-[12px] font-bold text-muted-foreground">
              No lab tests found in database. Add Laboratory Profiles in master data to show tests here.
            </div>
          )}
          {visibleTests.map((test) => {
            const isSelected = selectedTests.some((t) => t.id === test.id);
            return (
              <button
                key={test.id}
                type="button"
                onClick={() => toggleTest(test)}
                className={`w-full p-4 border rounded-lg cursor-pointer flex items-center justify-between transition-all select-none text-left ${
                  isSelected ? "border-primary bg-primary/[0.02]" : "border-border hover:border-border/80 bg-background/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  {isSelected ? (
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground/60 shrink-0" />
                  )}
                  <div>
                    <h4 className="text-[13px] font-bold text-foreground leading-snug">{test.name}</h4>
                    <span className="text-[10px] text-muted-foreground font-semibold mt-0.5 block">
                      {test.code} {test.category ? `- ${test.category}` : ""}
                    </span>
                  </div>
                </div>
                <span className="text-[13px] font-bold text-foreground">
                  Rs. {Number(test.price || 0).toFixed(2)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
