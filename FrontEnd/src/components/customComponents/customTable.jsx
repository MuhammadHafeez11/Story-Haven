import { useState } from "react"
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table"
import {
  FaSort,
  FaSortUp,
  FaSortDown,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa"
import "./customTable.css"

const CustomTable = ({ columns, data }) => {
  // State for sorting
  const [sorting, setSorting] = useState([])

  // State for pagination
  const [pagination, setPagination] = useState({
    pageIndex: 0, // Start on page 0
    pageSize: 5, // Default page size
  })

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), // Enable sorting
    getPaginationRowModel: getPaginationRowModel(), // Enable pagination
  })

  // Calculate the total number of pages
  const totalPages = table.getPageCount()

  return (
    <div className="custom-table-container">
      <div className="table-responsive">
        <table className="custom-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={header.column.getIsSorted() ? `sorted-${header.column.getIsSorted()}` : ""}
                  >
                    <div className="th-content">
                      {header.isPlaceholder ? null : (
                        <div className="th-text">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <span className="sort-icon">
                            {header.column.getIsSorted() === "asc" ? (
                              <FaSortUp />
                            ) : header.column.getIsSorted() === "desc" ? (
                              <FaSortDown />
                            ) : (
                              <FaSort className="unsorted-icon" />
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} data-label={cell.column.columnDef.header}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="no-data">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="pagination-controls">
        <div className="pagination-buttons">
          <button
            className="pagination-button"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            title="First Page"
          >
            <FaAngleDoubleLeft />
          </button>
          <button
            className="pagination-button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            title="Previous Page"
          >
            <FaAngleLeft />
          </button>

          <div className="pagination-info">
            <span className="page-text">
              Page <span className="current-page">{table.getState().pagination.pageIndex + 1}</span> of{" "}
              <span className="total-pages">{totalPages}</span>
            </span>
          </div>

          <button
            className="pagination-button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            title="Next Page"
          >
            <FaAngleRight />
          </button>
          <button
            className="pagination-button"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            title="Last Page"
          >
            <FaAngleDoubleRight />
          </button>
        </div>

        <div className="pagination-options">
          <div className="go-to-page">
            <span>Go to:</span>
            <input
              type="number"
              value={table.getState().pagination.pageIndex + 1}
              min={1}
              max={totalPages}
              onChange={(e) => {
                let page = e.target.value ? Number(e.target.value) - 1 : 0
                if (page < 0) page = 0
                if (page >= totalPages) page = totalPages - 1
                table.setPageIndex(page)
              }}
              aria-label="Go to page"
            />
          </div>

          <div className="page-size-selector">
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value))
              }}
              aria-label="Rows per page"
            >
              {[5, 10, 20].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize} rows
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomTable