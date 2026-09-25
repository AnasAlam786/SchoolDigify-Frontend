import React, { useMemo, useState } from "react";
import Chart from "react-apexcharts";

export default function CollectionTrend({ data = [] }) {
  const [viewMode, setViewMode] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState(null);

  /* -------------------- FORMATTERS -------------------- */

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  const formatCompactCurrency = (value) =>
    new Intl.NumberFormat("en-IN", {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value || 0);

  const formatNumber = (value) =>
    new Intl.NumberFormat("en-IN").format(value || 0);

  const formatDate = (date) =>
    new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);

  const formatMonth = (date) =>
    new Intl.DateTimeFormat("en-IN", {
      month: "long",
      year: "numeric",
    }).format(date);

  /* -------------------- DATE HELPERS -------------------- */

  const startOfDay = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const endOfDay = (date) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  };

  const startOfWeek = (date) => {
    const d = startOfDay(date);
    const day = d.getDay();
    d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
    return d;
  };

  const endOfWeek = (date) => {
    const d = startOfWeek(date);
    d.setDate(d.getDate() + 6);
    return endOfDay(d);
  };

  const startOfMonth = (date) => {
    const d = new Date(date);
    d.setDate(1);
    return startOfDay(d);
  };

  const endOfMonth = (date) => {
    const d = new Date(date);
    d.setMonth(d.getMonth() + 1, 0);
    return endOfDay(d);
  };

  /* Number of calendar days between two timestamps, inclusive */
  const daysBetween = (min, max) => {
    if (!min || !max) return 0;

    const start = startOfDay(min).getTime();
    const end = startOfDay(max).getTime();

    return Math.max(
      1,
      Math.floor((end - start) / 86400000) + 1
    );
  };

  /* -------------------- NORMALIZE DATA -------------------- */

  const chartData = useMemo(
    () =>
      data
        .filter((item) => item.payment_date)
        .map((item) => ({
          x: new Date(`${item.payment_date}T00:00:00`).getTime(),
          y: Number(item.total_amount || 0),
          transaction_count: Number(item.transaction_count || 0),
        }))
        .sort((a, b) => a.x - b.x),
    [data]
  );

  /* -------------------- DATA BOUNDS -------------------- */

  const dataBounds = useMemo(() => {
    if (!chartData.length) return { min: null, max: null };

    return {
      min: chartData[0].x,
      max: chartData[chartData.length - 1].x,
    };
  }, [chartData]);

  /* -------------------- RANGE HELPERS -------------------- */

  const clampRange = (start, end) => {
    if (!dataBounds.min || !dataBounds.max) return { start, end };

    return {
      start: Math.max(start, dataBounds.min),
      end: Math.min(end, dataBounds.max),
    };
  };

  /* -------------------- CURRENT VIEW -------------------- */

  const viewRange = useMemo(() => {
    if (!dataBounds.min || !dataBounds.max) {
      return { start: null, end: null };
    }

    if (viewMode === "all") {
      return {
        start: dataBounds.min,
        end: dataBounds.max,
      };
    }

    const start =
      viewMode === "week"
        ? startOfWeek(currentDate).getTime()
        : startOfMonth(currentDate).getTime();

    const end =
      viewMode === "week"
        ? endOfWeek(currentDate).getTime()
        : endOfMonth(currentDate).getTime();

    return clampRange(start, end);
  }, [viewMode, currentDate, dataBounds]);

  /* -------------------- CALCULATE TOTALS -------------------- */

  const calculateTotals = (min, max) => {
    if (!chartData.length || !min || !max) {
      return {
        amount: 0,
        transactions: 0,
        days: 0,
        averagePerDay: 0,
      };
    }

    const selected = chartData.filter(
      (point) => point.x >= min && point.x <= max
    );

    const amount = selected.reduce(
      (total, point) => total + point.y,
      0
    );

    const transactions = selected.reduce(
      (total, point) => total + point.transaction_count,
      0
    );

    const days = daysBetween(min, max);

    return {
      amount,
      transactions,
      days,
      averagePerDay: days > 0 ? amount / days : 0,
    };
  };

  /* -------------------- DISPLAY TOTALS -------------------- */

  const displayTotals = useMemo(() => {
    if (!viewRange.start || !viewRange.end) {
      return {
        amount: 0,
        transactions: 0,
        days: 0,
        averagePerDay: 0,
      };
    }

    const min = selectedRange?.min ?? viewRange.start;
    const max = selectedRange?.max ?? viewRange.end;

    return calculateTotals(min, max);
  }, [selectedRange, viewRange, chartData]);

  /* -------------------- NAVIGATION LIMITS -------------------- */

  const canGoPrevious = useMemo(() => {
    if (!dataBounds.min || viewMode === "all") return false;

    const previous = new Date(currentDate);

    if (viewMode === "month") {
      previous.setMonth(previous.getMonth() - 1);
      return endOfMonth(previous).getTime() >= dataBounds.min;
    }

    previous.setDate(previous.getDate() - 7);
    return endOfWeek(previous).getTime() >= dataBounds.min;
  }, [currentDate, viewMode, dataBounds]);

  const canGoNext = useMemo(() => {
    if (!dataBounds.max || viewMode === "all") return false;

    const next = new Date(currentDate);

    if (viewMode === "month") {
      next.setMonth(next.getMonth() + 1);
      return startOfMonth(next).getTime() <= dataBounds.max;
    }

    next.setDate(next.getDate() + 7);
    return startOfWeek(next).getTime() <= dataBounds.max;
  }, [currentDate, viewMode, dataBounds]);

  /* -------------------- NAVIGATION -------------------- */

  const movePrevious = () => {
    if (!canGoPrevious) return;

    setSelectedRange(null);

    setCurrentDate((date) => {
      const next = new Date(date);

      if (viewMode === "month") {
        next.setMonth(next.getMonth() - 1);
      } else {
        next.setDate(next.getDate() - 7);
      }

      return next;
    });
  };

  const moveNext = () => {
    if (!canGoNext) return;

    setSelectedRange(null);

    setCurrentDate((date) => {
      const next = new Date(date);

      if (viewMode === "month") {
        next.setMonth(next.getMonth() + 1);
      } else {
        next.setDate(next.getDate() + 7);
      }

      return next;
    });
  };

  /* -------------------- TODAY / VIEW -------------------- */

  const goToday = () => {
    if (!dataBounds.min || !dataBounds.max) return;

    const today = new Date();

    setCurrentDate(
      today > dataBounds.max
        ? new Date(dataBounds.max)
        : today < dataBounds.min
          ? new Date(dataBounds.min)
          : today
    );

    setSelectedRange(null);
  };

  const showAll = () => {
    setViewMode("all");
    setSelectedRange(null);

    if (dataBounds.max) {
      setCurrentDate(new Date(dataBounds.max));
    }
  };

  const changeViewMode = (mode) => {
    setViewMode(mode);
    setSelectedRange(null);

    // Always open the latest available period
    if (dataBounds.max) {
      setCurrentDate(new Date(dataBounds.max));
    }
  };

  const clearSelection = () => setSelectedRange(null);

  /* -------------------- RANGE LABEL -------------------- */

  const rangeLabel = useMemo(() => {
    if (!viewRange.start || !viewRange.end) return "";

    if (viewMode === "all") {
      return `${formatDate(new Date(viewRange.start))} — ${formatDate(
        new Date(viewRange.end)
      )}`;
    }

    if (viewMode === "month") {
      return formatMonth(currentDate);
    }

    return `${formatDate(new Date(viewRange.start))} — ${formatDate(
      new Date(viewRange.end)
    )}`;
  }, [viewMode, viewRange, currentDate]);

  /* -------------------- APEX OPTIONS -------------------- */

  const options = {
    chart: {
      type: "area",
      height: 380,
      background: "transparent",

      toolbar: {
        show: false,
      },

      zoom: {
        enabled: true,
        type: "x",
        autoScaleYaxis: true,
      },

      selection: {
        enabled: true,
        xaxis: {
          min: viewRange.start,
          max: viewRange.end,
        },
        fill: {
          color: "#d4d4d4",
          opacity: 0.12,
        },
        stroke: {
          color: "#d4d4d4",
          width: 1,
          dashArray: 3,
        },
      },

      animations: {
        enabled: true,
        speed: 350,
      },

      events: {
        selection: (_, { xaxis }) => {
          if (!xaxis?.min || !xaxis?.max) return;

          const min = Math.max(xaxis.min, dataBounds.min);
          const max = Math.min(xaxis.max, dataBounds.max);

          if (min >= max) return;

          setSelectedRange({ min, max });
        },

        zoomed: (_, { xaxis }) => {
          if (!xaxis?.min || !xaxis?.max) return;

          const min = Math.max(xaxis.min, dataBounds.min);
          const max = Math.min(xaxis.max, dataBounds.max);

          if (min >= max) return;

          setSelectedRange({ min, max });
        },
      },
    },

    theme: {
      mode: "dark",
    },

    stroke: {
      curve: "smooth",
      width: 3,
    },

    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.02,
        stops: [0, 85, 100],
      },
    },

    colors: ["#d4d4d4"],

    markers: {
      size: 0,
      hover: {
        size: 6,
      },
    },

    dataLabels: {
      enabled: false,
    },

    grid: {
      borderColor: "rgba(255,255,255,0.08)",
      strokeDashArray: 4,
      padding: {
        left: 8,
        right: 12,
      },
    },

    xaxis: {
      type: "datetime",
      min: viewRange.start,
      max: viewRange.end,

      labels: {
        datetimeUTC: false,
        style: {
          colors: "#9CA3AF",
          fontSize: "11px",
        },
      },

      axisBorder: {
        show: false,
      },

      axisTicks: {
        show: false,
      },
    },

    yaxis: {
      labels: {
        style: {
          colors: "#9CA3AF",
          fontSize: "11px",
        },
        formatter: formatCompactCurrency,
      },
    },

    tooltip: {
      theme: "dark",
      shared: false,

      x: {
        format: "dd MMM yyyy",
      },

      custom: ({ seriesIndex, dataPointIndex, w }) => {
        const point =
          w.config.series[seriesIndex]?.data[dataPointIndex];

        if (!point) return "";

        const date = new Date(point.x);

        const dayName = new Intl.DateTimeFormat("en-IN", {
          weekday: "long",
        }).format(date);

        const dateLabel = new Intl.DateTimeFormat("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(date);

        return `
          <div style="
            padding:12px 14px;
            background:#171717;
            border:1px solid #333;
            border-radius:8px;
            min-width:190px;
          ">
            <div style="
              color:#f5f5f5;
              font-size:13px;
              font-weight:600;
              margin-bottom:10px;
            ">
              ${dayName}, ${dateLabel}
            </div>

            <div style="
              color:#f5f5f5;
              font-size:15px;
              font-weight:600;
              margin-bottom:6px;
            ">
              ${formatCurrency(point.y)}
            </div>

            <div style="
              color:#a3a3a3;
              font-size:12px;
            ">
              ${formatNumber(point.transaction_count)} transactions
            </div>
          </div>
        `;
      },
    },

    legend: {
      show: false,
    },

    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: {
            height: 300,
          },
          xaxis: {
            labels: {
              rotate: -45,
            },
          },
        },
      },
    ],
  };

  /* -------------------- EMPTY STATE -------------------- */

  if (!data.length) {
    return (
      <div className="
        flex h-64 items-center justify-center rounded-xl
        border border-[#2A2A2A] bg-[#111111] text-sm text-gray-500
      ">
        No collection data available
      </div>
    );
  }

  /* -------------------- RENDER -------------------- */

  return (
    <div className="
      overflow-hidden rounded-xl border border-[#2A2A2A]
      bg-[#111111] p-3 sm:p-4
    ">
      {/* HEADER */}
      <div className="
        mb-4 flex flex-col gap-3
        sm:flex-row sm:items-center sm:justify-between
      ">
        <div>
          <h3 className="text-sm font-semibold text-gray-100">
            Fee Collection
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            {rangeLabel}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={movePrevious}
            disabled={!canGoPrevious}
            title={viewMode === "month" ? "Previous month" : "Previous week"}
            className="
              rounded-lg border border-[#2A2A2A] bg-[#171717]
              px-3 py-2 text-gray-300 transition hover:bg-[#222]
              disabled:cursor-not-allowed disabled:opacity-30
            "
          >
            ←
          </button>

          <button
            onClick={goToday}
            className="
              rounded-lg border border-[#2A2A2A] bg-[#171717]
              px-3 py-2 text-xs text-gray-300 transition hover:bg-[#222]
            "
          >
            Today
          </button>

          <button
            onClick={moveNext}
            disabled={!canGoNext}
            title={viewMode === "month" ? "Next month" : "Next week"}
            className="
              rounded-lg border border-[#2A2A2A] bg-[#171717]
              px-3 py-2 text-gray-300 transition hover:bg-[#222]
              disabled:cursor-not-allowed disabled:opacity-30
            "
          >
            →
          </button>
        </div>
      </div>

      {/* VIEW SELECTOR */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="
          flex overflow-hidden rounded-lg border border-[#2A2A2A]
          bg-[#171717] p-1
        ">
          {["week", "month"].map((mode) => (
            <button
              key={mode}
              onClick={() => changeViewMode(mode)}
              className={`
                rounded-md px-3 py-1.5 text-xs transition
                ${viewMode === mode
                  ? "bg-[#2A2A2A] text-white"
                  : "text-gray-500 hover:text-gray-300"
                }
              `}
            >
              {mode[0].toUpperCase() + mode.slice(1)}
            </button>
          ))}

          <button
            onClick={showAll}
            className={`
              rounded-md px-3 py-1.5 text-xs transition
              ${viewMode === "all"
                ? "bg-[#2A2A2A] text-white"
                : "text-gray-500 hover:text-gray-300"
              }
            `}
          >
            All
          </button>
        </div>

        {selectedRange && (
          <button
            onClick={clearSelection}
            className="
              rounded-lg border border-[#2A2A2A] px-3 py-1.5
              text-xs text-gray-400 transition hover:bg-[#1A1A1A]
              hover:text-white
            "
          >
            Reset selection
          </button>
        )}
      </div>

      {/* SUMMARY */}
      <div className="
        mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3
      ">
        <div className="
          rounded-lg border border-[#242424] bg-[#171717] p-3
        ">
          <div className="text-[11px] text-gray-500">
            Collection
          </div>
          <div className="mt-1 text-base font-semibold text-gray-100">
            {formatCurrency(displayTotals.amount)}
          </div>
        </div>

        <div className="
          rounded-lg border border-[#242424] bg-[#171717] p-3
        ">
          <div className="text-[11px] text-gray-500">
            Transactions
          </div>
          <div className="mt-1 text-base font-semibold text-gray-100">
            {formatNumber(displayTotals.transactions)}
          </div>
        </div>

        <div className="
          col-span-2 rounded-lg border border-[#242424]
          bg-[#171717] p-3 sm:col-span-1
        ">
          <div className="text-[11px] text-gray-500">
            Avg. / day
          </div>
          <div className="mt-1 text-base font-semibold text-gray-100">
            {formatCurrency(displayTotals.averagePerDay)}
          </div>
        </div>
      </div>

      {/* SELECTED RANGE */}
      {selectedRange && (
        <div className="
          mb-3 rounded-lg border border-[#2A2A2A]
          bg-[#151515] px-3 py-2 text-xs text-gray-400
        ">
          Selected:
          <span className="ml-1 text-gray-200">
            {formatDate(new Date(selectedRange.min))}
          </span>
          <span className="mx-1">—</span>
          <span className="text-gray-200">
            {formatDate(new Date(selectedRange.max))}
          </span>
        </div>
      )}

      {/* CHART */}
      <Chart
        options={options}
        series={[
          {
            name: "Collection",
            data: chartData,
          },
        ]}
        type="area"
        height={380}
        width="100%"
      />

      {/* FOOTER */}
      <div className="mt-1 text-center text-[10px] text-gray-600">
        Drag across the chart to see collection totals for a specific period
      </div>
    </div>
  );
}