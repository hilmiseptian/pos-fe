export default function ReportTable({ columns, data, isLoading, colSpan }) {
  return (
    <div className="bg-base-100 border border-base-300 rounded-2xl overflow-hidden">
      <table className="table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            [...Array(5)].map((_, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col}>
                    <div className="skeleton h-4 w-24 rounded" />
                  </td>
                ))}
              </tr>
            ))
          ) : data?.length > 0 ? (
            data
          ) : (
            <tr>
              <td
                colSpan={colSpan ?? columns.length}
                className="text-center py-12 text-base-content/30 text-sm">
                {data === null || data === undefined
                  ? 'Select a date range and click Apply to load data.'
                  : 'No data found for the selected filters.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
