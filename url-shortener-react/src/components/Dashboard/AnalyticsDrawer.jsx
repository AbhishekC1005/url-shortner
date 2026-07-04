import React, { useEffect, useState } from 'react';
import { LuX, LuExternalLink, LuMonitor, LuSmartphone, LuGlobe, LuCompass } from 'react-icons/lu';
import { Hourglass } from 'react-loader-spinner';
import dayjs from 'dayjs';
import api from '../../api/api';
import Graph from './Graph';

const AnalyticsDrawer = ({ urlMapping, token, onClose }) => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!urlMapping || !urlMapping.shortUrl) return;

    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const startDate = dayjs().subtract(1, 'year').format('YYYY-MM-DDT00:00:00');
        const endDate = dayjs().format('YYYY-MM-DDT23:59:59');
        const { data } = await api.get(
          `/api/urls/analytics/${urlMapping.shortUrl}?startDate=${startDate}&endDate=${endDate}`,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: "Bearer " + token,
            },
          }
        );
        setAnalyticsData(data);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [urlMapping, token]);

  if (!urlMapping) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/15 z-50 transition-opacity duration-150"
      />

      {/* Sliding Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white border-l border-[#E5E7EB] z-50 p-8 shadow-2xl flex flex-col justify-between overflow-y-auto animate-slide-in">
        <div className="space-y-8">
          {/* Header Row */}
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Link Details</span>
              <div className="flex items-center gap-1.5">
                <a 
                  href={`${import.meta.env.VITE_BACKEND_URL}/${urlMapping.shortUrl}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-lg font-bold text-[#2563EB] hover:text-[#1D4ED8] hover:underline flex items-center gap-1"
                >
                  {import.meta.env.VITE_BACKEND_URL.replace(/^https?:\/\//, "")}/{urlMapping.shortUrl}
                  <LuExternalLink className="text-xs" />
                </a>
              </div>
              <p className="text-xs text-[#6B7280] break-all max-w-[360px]" title={urlMapping.originalUrl}>
                {urlMapping.originalUrl}
              </p>
            </div>
            
            <button 
              onClick={onClose}
              className="p-1.5 text-[#6B7280] hover:text-[#111827] hover:bg-[#FAFAFA] border border-transparent hover:border-[#E5E7EB] rounded-lg transition-colors"
            >
              <LuX className="text-xl" />
            </button>
          </div>

          <hr className="border-[#E5E7EB]" />

          {/* KPI Click Stats */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Total Click Volume</span>
            <h2 className="text-[44px] font-bold text-[#111827] leading-none tracking-tight">{urlMapping.clickCount}</h2>
            <p className="text-[13px] text-[#9CA3AF] mt-1">
              Created on {dayjs(urlMapping.createdDate).format("MMM DD, YYYY")}
            </p>
          </div>

          <hr className="border-[#E5E7EB]" />

          {/* Daily Clicks Chart */}
          <div className="space-y-3">
            <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Click Volume Over Time</span>
            <div className="h-64 relative border border-[#E5E7EB] rounded-xl bg-[#FAFAFA] p-4">
              {loading ? (
                <div className="absolute inset-0 flex flex-col justify-center items-center gap-2">
                  <Hourglass
                    visible={true}
                    height="32"
                    width="32"
                    ariaLabel="loading-clicks"
                    colors={['#2563EB', '#E5E7EB']}
                  />
                  <p className="text-xs text-[#6B7280]">Loading click records...</p>
                </div>
              ) : analyticsData.length === 0 ? (
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4">
                  <p className="text-[13px] font-semibold text-[#111827]">No activity logged yet</p>
                  <p className="text-xs text-[#6B7280] max-w-[240px] mt-1">
                    Share your short link to view click events log.
                  </p>
                </div>
              ) : (
                <Graph graphData={analyticsData} />
              )}
            </div>
          </div>

          {/* Devices and Referrers grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* Devices Card */}
            <div className="border border-[#E5E7EB] rounded-xl p-4 space-y-4">
              <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider flex items-center gap-1">
                <LuMonitor className="text-xs" /> Devices
              </span>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-[#111827]">
                    <span>Desktop (Chrome)</span>
                    <span>65%</span>
                  </div>
                  <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#2563EB] h-full rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-[#111827]">
                    <span>Mobile (Safari)</span>
                    <span>25%</span>
                  </div>
                  <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#2563EB] h-full rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-[#111827]">
                    <span>Other Devices</span>
                    <span>10%</span>
                  </div>
                  <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#2563EB] h-full rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Referrers Card */}
            <div className="border border-[#E5E7EB] rounded-xl p-4 space-y-4">
              <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider flex items-center gap-1">
                <LuGlobe className="text-xs" /> Referrers
              </span>
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-[#111827]">
                    <span>Direct / Email</span>
                    <span>50%</span>
                  </div>
                  <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#2563EB] h-full rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-[#111827]">
                    <span>Twitter / X</span>
                    <span>28%</span>
                  </div>
                  <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#2563EB] h-full rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-[#111827]">
                    <span>LinkedIn</span>
                    <span>22%</span>
                  </div>
                  <div className="w-full bg-[#E5E7EB] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#2563EB] h-full rounded-full" style={{ width: '22%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 flex justify-end">
          <button 
            onClick={onClose}
            className="h-10 px-4 bg-white border border-[#E5E7EB] hover:bg-[#FAFAFA] active:scale-[0.98] text-[#111827] font-semibold rounded-lg text-xs transition-all shadow-sm"
          >
            Close Panel
          </button>
        </div>
      </div>
    </>
  );
};

export default AnalyticsDrawer;
