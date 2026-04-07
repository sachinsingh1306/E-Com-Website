const Loader = ({ message = "Loading..." }) => {
  return (
    <div
      className="flex items-center justify-center py-10"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-4 rounded-2xl border border-sky-200 bg-white px-6 py-4 shadow-md">
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600" />
        <span className="text-sm font-medium text-slate-700">{message}</span>
      </div>
    </div>
  );
};

export default Loader;
