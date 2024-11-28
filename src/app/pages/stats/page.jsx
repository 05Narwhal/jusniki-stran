"use client";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { PieChart, Pie, Cell } from "recharts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { 
  useReactTable, 
  getCoreRowModel, 
  getFilteredRowModel, 
  getPaginationRowModel, 
  flexRender,
  SortingState,
  getSortedRowModel,
  ColumnDef
} from "@tanstack/react-table";
import { readAllStats } from "@/app/utils/databaseManager";
import { getTheme } from "@/app/utils/projectColors";
import Loader from "@/app/components/Loader/Loader";
import './styles.scss';

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// Custom sorting functions
const customSorters = {
  alphanumeric: (rowA, rowB, columnId) => {
    return rowA.getValue(columnId).localeCompare(rowB.getValue(columnId), 'sl', { sensitivity: 'base' });
  },
  numeric: (rowA, rowB, columnId) => {
    return parseFloat(rowA.getValue(columnId)) - parseFloat(rowB.getValue(columnId));
  },
  date: (rowA, rowB, columnId) => {
    // Parse date in "dd/mm/yyyy-hh:mm:ss" format
    const parseCustomDate = (dateString) => {
      const [datePart, timePart] = dateString.split('-');
      const [day, month, year] = datePart.split('/').map(Number);
      const [hours, minutes, seconds] = timePart.split(':').map(Number);
      
      // Note: month is 0-indexed in Date constructor
      return new Date(year, month - 1, day, hours, minutes, seconds);
    };

    const dateA = parseCustomDate(rowA.getValue(columnId));
    const dateB = parseCustomDate(rowB.getValue(columnId));
    
    return dateA.getTime() - dateB.getTime(); // Descending order
  },
  'numeric-alphanumeric': (rowA, rowB, columnId) => {
    const valueA = rowA.getValue(columnId);
    const valueB = rowB.getValue(columnId);

    const numericA = parseInt(valueA, 10);
    const numericB = parseInt(valueB, 10);

    if (isNaN(numericA) && isNaN(numericB)) {
      return valueA.localeCompare(valueB, 'sl', { sensitivity: 'base' });
    } else {
      return numericA - numericB;
    }
  },
};

// Column definitions with sorting enabled
const columns = [
  {
    id: "name", 
    header: "Ime", 
    accessorKey: "name",
    enableSorting: true,
    sortingFn: customSorters.alphanumeric
  },
  {
    id: "letnik", 
    header: "Letnik",
    accessorKey: "letnik",
    enableSorting: true,
    sortingFn: customSorters['numeric-alphanumeric']
  },
  {
    id: "date", 
    header: "Datum",
    accessorKey: "date",
    enableSorting: true,
    sortingFn: customSorters.date
  },
  {
    id: "id", 
    header: "ID",
    accessorKey: "id",
    enableSorting: true,
    sortingFn: customSorters.alphanumeric
  },
];

function DataTable({ data, columns }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div>
      {/* Global Filter */}
      <input
        value={globalFilter || ""}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search..."
        style={{ marginBottom: "10px", padding: "5px", width: "100%" }}
      />

      {/* Table */}
      <table className="table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{ cursor: 'pointer', position: 'relative' }}
                >
                  {header.column.columnDef.header}
                  {header.column.getCanSort() && (
                    <span 
                      style={{ 
                        position: 'absolute', 
                        right: '5px', 
                        top: '50%', 
                        transform: 'translateY(-50%)' 
                      }}
                    >
                      {header.column.getIsSorted() === "asc" ? "▲" : 
                       header.column.getIsSorted() === "desc" ? "▼" : "⇕"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{cell.getValue()}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: "10px" }}>
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
      </div>
    </div>
  );
}

function TowerGraph({ data }) {
  return (
    <BarChart width={400} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" fill="#8884d8" />
    </BarChart>
  );
}

function PieGraph({ data }) {
  return (
    <PieChart width={400} height={300}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        outerRadius={80}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  );
}

export default function StatsView() {
  const [loaded, setLoaded] = useState(false);
  const [allStats, setAllStats] = useState(null);
  const [graphData, setGraphData] = useState(null);

  useEffect(() => {
    readAllStats().then((res) => {
      if (res.success) {
        toast.success("Vse informacije naložene!");
        setAllStats(res.data);

        setLoaded(true);
      } else {
        toast.error("Nastal je error :P");
      }
    });
  }, []);

  if (!loaded && !allStats) {
    return <Loader primaryColor={getTheme() === "dark" ? "#fff" : "#000"} scale={2} />;
  }

  return (
    <div className="main-stats-cont">
      <div>
        <DataTable columns={columns} data={allStats} />
      </div>
      <div>
        {/* <TowerGraph data={graphData} />
        <PieGraph data={graphData} /> */}
      </div>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        pauseOnHover={false}
        closeOnClick
        rtl={false}
        theme={getTheme()}
      />
    </div>
  );
}