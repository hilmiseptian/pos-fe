export function SidebarSkeleton() {
  return (
    <div className="drawer lg:drawer-open">
      <div className="drawer-content">
        <div className="navbar bg-base-300 px-4">
          <div className="skeleton h-5 w-32"></div>

          <div className="ml-auto flex items-center gap-3">
            <div className="skeleton h-4 w-24"></div>
            <div className="skeleton h-8 w-16 rounded"></div>
          </div>
        </div>{' '}
      </div>
      <div className="drawer-side">
        <div className="flex min-h-full w-52 flex-col bg-base-200 p-4">
          <ul className="menu w-full space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <li key={i}>
                <div className="flex items-center gap-3">
                  {/* Icon skeleton */}
                  <div className="skeleton h-4 w-4 rounded"></div>

                  {/* Text skeleton */}
                  <div className="skeleton h-4 w-24"></div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
