export default function FormSkeleton({ rows = 5 }) {
  return (
    <div className="max-w-4xl mx-auto py-8 bg-base-200 px-6 mt-6 rounded-box">
      <div className="skeleton h-6 w-40 mb-6" />

      <div className="space-y-4">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="skeleton h-4 w-24" />
            <div className="skeleton h-10 w-full rounded-md" />
          </div>
        ))}

        <div className="flex justify-end gap-3 pt-4">
          <div className="skeleton h-10 w-24 rounded-md" />
          <div className="skeleton h-10 w-24 rounded-md" />
        </div>
      </div>
    </div>
  );
}
