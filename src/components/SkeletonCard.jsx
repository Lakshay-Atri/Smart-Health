import React from 'react';

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5 animate-pulse">
      {/* Header Section: Title & Status */}
      <div className="flex justify-between items-start">
        <div className="space-y-2.5 w-2/3">
          {/* Clinic Name Placeholder */}
          <div className="h-5 bg-slate-200 rounded-lg w-full"></div>
          {/* Location Badge Placeholder */}
          <div className="h-3.5 bg-slate-200/80 rounded-md w-1/2"></div>
        </div>
        {/* Stock Status Badge Placeholder */}
        <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
      </div>

      <hr className="border-slate-50" />

      {/* Metrics Row (Footfall & Doctors) */}
      <div className="grid grid-cols-2 gap-3">
        {/* Patients Today Stat Box */}
        <div className="p-3 bg-slate-50/50 border border-slate-100/50 rounded-xl space-y-2">
          <div className="h-3 bg-slate-200 rounded-md w-2/3"></div>
          <div className="h-6 bg-slate-200 rounded-md w-1/2"></div>
        </div>
        {/* Doctors Present Stat Box */}
        <div className="p-3 bg-slate-50/50 border border-slate-100/50 rounded-xl space-y-2">
          <div className="h-3 bg-slate-200 rounded-md w-2/3"></div>
          <div className="h-6 bg-slate-200 rounded-md w-1/2"></div>
        </div>
      </div>

      {/* Bed occupancy progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <div className="h-3 bg-slate-200 rounded-md w-1/4"></div>
          <div className="h-3 bg-slate-200 rounded-md w-1/3"></div>
        </div>
        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-slate-200 rounded-full w-1/2"></div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;
