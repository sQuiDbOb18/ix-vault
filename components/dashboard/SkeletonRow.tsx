export function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 8 }).map((_, index) => (
        <td key={index} className="px-4 py-4">
          <div className="skeleton h-4 rounded" />
        </td>
      ))}
    </tr>
  );
}
