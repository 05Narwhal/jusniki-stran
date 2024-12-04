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
  getSortedRowModel
} from "@tanstack/react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPieChart } from "@fortawesome/free-solid-svg-icons";

import { deepCopy, sum } from "../../utils/basicFuncs";
import { readAllStats }  from "../../utils/databaseManager";
import { getTheme }      from "../../utils/projectColors";
import Loader            from "../../components/Loader/Loader";

import 'react-toastify/dist/ReactToastify.css';
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
  summative: (rowA, rowB, columnId) => {
    let valuesA = deepCopy(rowA.getValue(columnId))
    let valuesB = deepCopy(rowB.getValue(columnId))

    for (let k = 0;k < valuesA.length;k++) {
      valuesA[k] = parseFloat(valuesA[k].toString().replace(", ", ""))
    }

    for (let k = 0;k < valuesB.length;k++) {
      valuesB[k] = parseFloat(valuesB[k].toString().replace(", ", ""))
    }

    return sum(valuesA) - sum(valuesB);
  },
  quantitative: (rowA, rowB, columnId) => {
    let valuesA = deepCopy(rowA.getValue(columnId))
    let valuesB = deepCopy(rowB.getValue(columnId))

    for (let k = 0;k < valuesA.length;k++) {
      valuesA[k] = valuesA[k].toString().replace(", ", "")
    }

    for (let k = 0;k < valuesB.length;k++) {
      valuesB[k] = valuesB[k].toString().replace(", ", "")
    }
  
    // Find the smallest alphabetical value in each list
    const minA = valuesA.length ? valuesA.slice().sort()[0] : ""; // Sort to get the lowest alphabetical value
    const minB = valuesB.length ? valuesB.slice().sort()[0] : "";
  
    // Compare based on the lowest alphabetical value
    const alphabeticalComparison = minA.localeCompare(minB, 'sl', { sensitivity: 'base' });
  
    if (alphabeticalComparison !== 0) {
      return alphabeticalComparison;
    }
  
    // If alphabetical values are equal, sort by list size
    return valuesB.length - valuesA.length; // Change to valuesA.length - valuesB.length for ascending order by size
  },
  size: (rowA, rowB, columnId) => {
    let valuesA = deepCopy(rowA.getValue(columnId))
    let valuesB = deepCopy(rowB.getValue(columnId))

    const sizeOrder = {
      XS: 1,
      S: 2,
      M: 3,
      L: 4,
      XL: 5,
      XXL: 6
    };

    for (let k = 0;k < valuesA.length;k++) {
      valuesA[k] = sizeOrder[valuesA[k].toString().replace(", ", "")] || Infinity
    }

    for (let k = 0;k < valuesB.length;k++) {
      valuesB[k] = sizeOrder[valuesB[k].toString().replace(", ", "")] || Infinity
    }

    // Compare the numeric values directly
    if (Math.min(...valuesA) !== Math.min(...valuesB)) {
      return Math.min(...valuesA) - Math.min(...valuesB); // Sort by the lowest size value
    }

    // If the minimum size values are equal, compare by the length of the list
    return valuesB.length - valuesA.length; 
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
    header: "Letnik"+" ".repeat(15),
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
    id: 'količina',
    header: "količina"+" ".repeat(15),
    accessorKey: "orderLength",
    enableSorting: true,
    sortingFn: customSorters.summative
  },
  {
    id: 'barve',
    header: "barve"+" ".repeat(10),
    accessorKey: "colors",
    enableSorting: true,
    sortingFn: customSorters.quantitative
  },
  {
    id: 'sizes',
    header: "velikosti"+" ".repeat(15),
    accessorKey: "sizes",
    enableSorting: true,
    sortingFn: customSorters.size
  },
  {
    id: 'maxStock',
    header: "max Stock"+" ".repeat(10),
    accessorKey: "maxStock",
    enableSorting: true,
    sortingFn: customSorters.quantitative
  }
];

function DataTable({ data, columns, selectedColumn=()=>{} }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [currGraphDataSet, setCurrGraphDataSet] = useState("1")
  const [loaded, setLoaded] = useState(false)
  const [tableData, setTableData] = useState(null)

  const hasItemInKey = (list, key, item) => {
    for (let k = 0;k < list.length;k++) {
      if (list[k][key]) {
        if (list[k][key] === item) {
          return true
        } 
      } else {
        return null
      }
    }

    return false
  }

  const handleSelectedGraphData = () => {
    if (tableData !== null) {
      let tempData = deepCopy(tableData);
      let newData = []
      let count = 0
      let selectedName = columns[parseInt(currGraphDataSet)].accessorKey
      let specialReturn = [
        "colors",
        "orderLength",
        "sizes",
        "logoDesigns",
        "maxStock"
      ]

      console.log(selectedName)

      tempData = tempData.map((item) => item[selectedName]);

      tempData.map((item) => {
        if (!specialReturn.includes(selectedName)) {
          if (selectedName === "date") {
            item = item.slice(0, 5)

            if (hasItemInKey(newData, "name", item)) {
              for (let k = 0; k < newData.length;k++) {
                if (newData[k]["name"] === item) {
                  newData[k]["amount"] += 1
                }
              }
            } else {
              if (typeof item === "object") {
                for (let j = 0;j < item.length ;j++) {
                  item[j] = item[j].toString().replace(", ", "")
                }
              }

              newData.push({
                // id: count,
                name: item,
                amount: 1
              })
              count++
            }
          } else {
            if (hasItemInKey(newData, "name", item)) {
              for (let k = 0; k < newData.length;k++) {
                if (newData[k]["name"] === item) {
                  newData[k]["amount"] += 1
                }
              }
            } else {
              if (typeof item === "object") {
                for (let j = 0;j < item.length ;j++) {
                  item[j] = item[j].toString().replace(", ", "")
                }
              }

              newData.push({
                // id: count,
                name: item,
                amount: 1
              })
              count++
            }
          }
        } else {
          if (selectedName === "orderLength") {
            for (let j = 0;j < item.length ;j++) {
              item[j] = item[j].toString().replace(", ", "")
            }
  
            if (hasItemInKey(newData, "name", sum(item))) {
              for (let k = 0; k < newData.length;k++) {
                if (newData[k]["name"] === sum(item)) {
                  newData[k]["amount"] += 1
                }
              }
            } else {
              newData.push({
                // id: count,
                name: sum(item),
                amount: 1
              })
              count++
            }
          } else {
            for (let j = 0;j < item.length ;j++) {
              item[j] = item[j].toString().replace(", ", "")
            }

            for (let l = 0;l < item.length;l++) {
              if (hasItemInKey(newData, "name", item[l])) {
                for (let k = 0; k < newData.length;k++) {
                  if (newData[k]["name"] === item[l]) {
                    newData[k]["amount"] += 1
                  }
                }
              } else {
                newData.push({
                  id: count,
                  name: item[l],
                  amount: 1
                })
                count++
              }
            }
          }
        }
      })

      return newData;
    }

    return null
  }

  useEffect(() => {
    let tableData = []

    for (let person of data) {
      let colors = []
      let sizes = []
      let orderLength = []
      let maxStock = []

      for (let i = 0; i < person.order.length;i++) {
        colors.push(i + 1 < person.order.length? `${person.order[i].color}, `: person.order[i].color)
        sizes.push(i + 1 < person.order.length? `${person.order[i].size}, `: person.order[i].size)
        orderLength.push(i + 1 < person.order.length? `${person.order[i].quantity}, `: person.order[i].quantity)
        maxStock.push(i + 1 < person.order.length? `${person.order[i].maxStock}, `: person.order[i].maxStock)
      }

      tableData.push({
        colors,
        sizes,
        id: person.id,
        date: person.date,
        name: person.name,
        letnik: person.letnik,
        orderLength,
        maxStock
      })
    }

    setTableData(tableData)

    setLoaded(true)
  }, [])

  useEffect(()=> {
    let allBtns = document.querySelectorAll(".chart-btn")

    for (let btn of allBtns) {
      if (btn) {
        if (btn.id === currGraphDataSet) {
          btn.classList.remove("chart-btn-disabled")
        } else {
          btn.classList.add("chart-btn-disabled")
        }
      }
    }

    selectedColumn(
      columns[parseInt(currGraphDataSet)].header, 
      handleSelectedGraphData()
    )
  }, [loaded])

  useEffect(() => {
    selectedColumn(
      columns[parseInt(currGraphDataSet)].header, 
      handleSelectedGraphData()
    )
  }, [currGraphDataSet])

  const handleSetChartData = (e) => {
    let allBtns = document.querySelectorAll(".chart-btn")

    if (e) {
      for (let btn of allBtns) {
        if (btn.id === e.currentTarget.id) {
          btn.classList.remove("chart-btn-disabled")
        } else {
          btn.classList.add("chart-btn-disabled")
        }
      }
    } else {
      console.error("Button state Failed. Make sure E is defined!")
    }

    setCurrGraphDataSet(e.currentTarget.id)
  }

  const table = useReactTable({
    data: tableData? tableData : [],
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

  if (!loaded && !tableData) {
    return <Loader primaryColor={getTheme() === "dark" ? "#fff" : "#000"} scale={2} />
  }

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
              {headerGroup.headers.map((header, indx) => (
                <th
                  key={header.id}
                  style={{ cursor: 'pointer', position: 'relative' }}
                >
                  {header.column.columnDef.header}
                  {header.column.getCanSort() && (
                    <div
                      style={{ 
                        position: 'absolute', 
                        right: '5px', 
                        top: '50%', 
                        transform: 'translateY(-50%)', 
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: '1'
                      }}
                    >
                      <button
                        key={header}
                        id={indx}
                        className="chart-btn"
                        onClick={(e) => {
                          handleSetChartData(e)
                        }}
                      >
                        <FontAwesomeIcon icon={faPieChart} />
                      </button>
                      <div
                        onClick={header.column.getToggleSortingHandler()}
                        style={{
                          width: '10px'
                        }}
                      >
                        {header.column.getIsSorted() === "asc" ? "▲" : 
                        header.column.getIsSorted() === "desc" ? "▼" : "⇕"}
                      </div>
                    </div>
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

function TowerGraph({ data, width=400, height=300 }) {
  if (!data) {
    return <p>Loading...</p>
  }

  return (
    <BarChart width={width} height={height} data={data}>
      <CartesianGrid strokeDasharray="3 2" />
      <XAxis dataKey="name" />
      <YAxis 
        domain={[0, 'dataMax']} 
        allowDecimals={false}   
        interval={0}            
      />
      <Tooltip />
      <Bar dataKey="amount">
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Bar>
    </BarChart>
  );
}

function PieGraph({ data, width=400, height=300 }) {
  if (!data) {
    return <p>Loading...</p>
  }

  return (
    <PieChart width={width + 50} height={height}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        // label={({ name, percent }) => `'${name}' : ${(percent * 100).toFixed(0)}%`}
        outerRadius={100}
        fill="#8884d8"
        dataKey="amount"  // This is the numeric field used for the size of the segments
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
        console.log(res.data)

        setLoaded(true);
      } else {
        toast.error("Nastal je error :P");
      }
    });
  }, []);

  if (!loaded && !allStats) {
    return <Loader primaryColor={getTheme() === "dark" ? "#fff" : "#000"} scale={2} />;
  }

  const graphDiv = document.querySelector('.graph-div'); 
  let graphWidth = 400
  let graphHeight = 400
  
  if (typeof window !== 'undefined') {
    
    if (graphDiv) {
      let computedStyle = window.getComputedStyle(graphDiv); 
      graphWidth = parseInt(computedStyle.width.trim().slice(0, computedStyle.width.trim().length - 2))
      graphHeight = parseInt(computedStyle.height.trim().slice(0, computedStyle.height.trim().length - 2)) / 2

      console.log("width: ", graphWidth, graphHeight)
    }
  }

  return (
    <>
      <div className="main-stats-cont">
        <div>
          <DataTable 
            columns={columns} 
            data={allStats} 
            selectedColumn={(header, data) => {setGraphData(data); console.log(header, data)}}
          />
        </div>
        <div className="graph-div" style={{ translate: '-15%' }}>
          <PieGraph data={graphData} width={graphWidth} height={graphHeight}/>
          <TowerGraph data={graphData} width={graphWidth} height={graphHeight} />
        </div>
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
    </>
  );
}