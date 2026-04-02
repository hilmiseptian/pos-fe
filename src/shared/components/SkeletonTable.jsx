export default function SkeletonTable({ rows = 6, cols = 8 }) {
  return (
    <tbody>
      {[...Array(rows)].map((_, i) => (
        <tr key={i}>
          {[...Array(cols)].map((__, j) => (
            <td key={j}>
              <div className="skeleton h-4 w-24" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
