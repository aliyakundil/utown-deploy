import Skeleton from "./Skeleton";

interface AdminTableSkeletonProps {
  columns: number;
  rows?: number;
}

export default function AdminTableSkeleton({ columns, rows = 6 }: AdminTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <td key={colIndex}>
              <Skeleton height="14px" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}