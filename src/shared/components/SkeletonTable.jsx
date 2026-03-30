export default function SkeletonTable({ rows = 8 }) {
  return (
    <tbody>
      {[...Array(rows)].map((_, i) => (
        <tr key={i}>
          {/* <td>
            <div className="flex items-center gap-3">
              <div className="skeleton w-10 h-10 rounded-full" />
              <div className="flex flex-col gap-2">
                <div className="skeleton h-4 w-28" />
                <div className="skeleton h-3 w-20" />
              </div>
            </div>
          </td> */}

          <td>
            <div className="skeleton h-4 w-24" />
          </td>
          <td>
            <div className="skeleton h-4 w-24" />
          </td>
          <td>
            <div className="skeleton h-4 w-20" />
          </td>
          <td>
            <div className="skeleton h-4 w-16" />
          </td>
          <td>
            <div className="skeleton h-4 w-24" />
          </td>

          <td>
            <div className="skeleton h-6 w-16 rounded-md" />
          </td>

          <td>
            <div className="flex gap-2">
              <div className="skeleton h-6 w-10 rounded-md" />
              <div className="skeleton h-6 w-10 rounded-md" />
              <div className="skeleton h-6 w-10 rounded-md" />
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
}
