import React from 'react';
import { useFilterStore, type StatusType, type PlatformType } from '../store/useFilterStore';

export const FilterBar: React.FC = () => {
  const { startDate, endDate, status, platform, setStartDate, setEndDate, setStatus, setPlatform, resetFilters } =
    useFilterStore();

  const handleStatusChange = (value: StatusType) => {
    if (status.includes(value)) {
      setStatus(status.filter((s) => s !== value));
    } else {
      setStatus([...status, value]);
    }
  };

  const handlePlatformChange = (value: PlatformType) => {
    if (platform.includes(value)) {
      setPlatform(platform.filter((p) => p !== value));
    } else {
      setPlatform([...platform, value]);
    }
  };

  return (
    <div className="mb-6 space-y-4 rounded-lg border bg-white p-5 shadow-sm md:flex md:items-center md:gap-8 md:space-y-0">
      {/* 집행 기간 */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-bold whitespace-nowrap text-gray-700">집행 기간</label>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded border px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-gray-400">~</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded border px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* 상태 (다중 선택) */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-bold whitespace-nowrap text-gray-700">상태</label>
        <div className="flex gap-2">
          {[
            { id: 'active', label: '진행중' },
            { id: 'paused', label: '일시중지' },
            { id: 'ended', label: '종료' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleStatusChange(item.id as StatusType)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                status.includes(item.id as StatusType)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 매체 (다중 선택) */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-bold whitespace-nowrap text-gray-700">매체</label>
        <div className="flex gap-2">
          {['Google', 'Meta', 'Naver'].map((p) => (
            <button
              key={p}
              onClick={() => handlePlatformChange(p as PlatformType)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                platform.includes(p as PlatformType)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* 초기화 */}
      <button
        onClick={resetFilters}
        className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-800 md:ml-auto"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        초기화
      </button>
    </div>
  );
};
