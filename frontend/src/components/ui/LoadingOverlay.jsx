export function LoadingOverlay({ isLoading, message = 'Loading...' }) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px]">
      <div className="bg-white rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center gap-5 max-w-xs w-full mx-4">
        {/* Spinner */}
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-4 border-[#fce4ec]" />
          <div className="absolute inset-0 rounded-full border-4 border-t-[#E91E63] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        </div>

        {/* Message */}
        <div className="text-center">
          <p className="text-[15px] font-bold text-slate-800 leading-snug">{message}</p>
          <p className="text-[13px] text-slate-400 font-medium mt-1">Please wait a moment...</p>
        </div>
      </div>
    </div>
  );
}
