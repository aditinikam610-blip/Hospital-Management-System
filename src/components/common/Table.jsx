function Table({ columns, rows, rowKey = "id" }) {
  return (
    <div className="overflow-x-auto rounded-card border border-border">
      <table className="min-w-full divide-y divide-border text-sm">
        <thead className="bg-bg">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left font-medium text-text-muted"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-border bg-surface">
          {rows.map((row) => (
            <tr
              key={row[rowKey]}
              className="hover:bg-bg/60"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-4 py-3 text-text"
                >
                  {col.render
                    ? col.render(row)
                    : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;