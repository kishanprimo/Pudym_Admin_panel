const DashboardPage = () => {
  return (
    <div className="px-4 py-6 md:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#101828] md:text-3xl">
          Dashboard
        </h1>

        <p className="mt-1 text-[15px] text-[#667085]">
          Welcome back! Here&apos;s what&apos;s
          happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Users
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            12,450
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Active Users
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            8,240
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Creators
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            1,284
          </h2>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Revenue
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            ₹12.45L
          </h2>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;