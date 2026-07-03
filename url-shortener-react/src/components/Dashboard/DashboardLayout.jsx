import React, { useState, useEffect } from 'react'
import Graph from './Graph'
import { useStoreContext } from '../../contextApi/ContextApi'
import { useFetchMyShortUrls, useFetchTotalClicks } from '../../hooks/useQuery'
import ShortenPopUp from './ShortenPopUp'
import { LuLink, LuSearch, LuCheck, LuPlus, LuActivity, LuLifeBuoy, LuLogOut } from 'react-icons/lu'
import ShortenUrlList from './ShortenUrlList'
import { useNavigate } from 'react-router-dom'
import Loader from '../Loader'
import AnalyticsDrawer from './AnalyticsDrawer'
import dayjs from 'dayjs'
import api from '../../api/api'

const DashboardLayout = () => {
    const { token, setToken } = useStoreContext();
    const navigate = useNavigate();
    const [shortenPopUp, setShortenPopUp] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedAnalyticsUrl, setSelectedAnalyticsUrl] = useState(null);
    const [activeTab, setActiveTab] = useState("links");
    const [selectedLinkForAnalytics, setSelectedLinkForAnalytics] = useState("all");
    const [singleLinkAnalyticsData, setSingleLinkAnalyticsData] = useState([]);
    const [loadingSingleLink, setLoadingSingleLink] = useState(false);


    const { isLoading, data: myShortenUrls = [], refetch } = useFetchMyShortUrls(token, onError)
    const { isLoading: loader, data: totalClicks = [] } = useFetchTotalClicks(token, onError)

    useEffect(() => {
        if (selectedLinkForAnalytics === "all") {
            setSingleLinkAnalyticsData([]);
            return;
        }
        const fetchSingleLinkAnalytics = async () => {
            setLoadingSingleLink(true);
            try {
                const startDate = dayjs().subtract(1, 'year').format('YYYY-MM-DDT00:00:00');
                const endDate = dayjs().format('YYYY-MM-DDT23:59:59');
                const { data } = await api.get(
                    `/api/urls/analytics/${selectedLinkForAnalytics}?startDate=${startDate}&endDate=${endDate}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                            Authorization: "Bearer " + token,
                        },
                    }
                );
                setSingleLinkAnalyticsData(data);
            } catch (error) {
                console.error("Failed to fetch single link analytics", error);
            } finally {
                setLoadingSingleLink(false);
            }
        };
        fetchSingleLinkAnalytics();
    }, [selectedLinkForAnalytics, token]);

    function onError() {
        navigate("/error");
    }

    const onLogout = () => {
        setToken(null);
        localStorage.removeItem("JWT_TOKEN");
        navigate("/login");
    };

    const totalLinks = myShortenUrls?.length || 0;
    const totalClicksCount = myShortenUrls?.reduce((acc, curr) => acc + curr.clickCount, 0) || 0;

    const selectedUrlObj = myShortenUrls?.find(url => url.shortUrl === selectedLinkForAnalytics);
    const activeTotalLinks = selectedLinkForAnalytics === "all" ? totalLinks : 1;
    const activeTotalClicks = selectedLinkForAnalytics === "all" ? totalClicksCount : (selectedUrlObj?.clickCount || 0);

    const filteredUrls = myShortenUrls?.filter(url =>
        url.shortUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
        url.originalUrl.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden" style={{ background: "var(--g-surface)", fontFamily: "var(--g-font)" }}>

            {/* ── Sidebar ──────────────────────────────────────────────── */}
            <aside className="w-[220px] flex-shrink-0 flex flex-col border-r h-full" style={{ borderColor: "var(--g-border)", background: "var(--g-surface)" }}>



                {/* Create Link Button */}
                <div className="px-4 pt-4 pb-2">
                    <button
                        onClick={() => setShortenPopUp(true)}
                        className="w-full flex items-center justify-center gap-2 g-btn-primary"
                        style={{ fontFamily: "var(--g-font)", height: 38, borderRadius: 8, fontSize: "0.8125rem", fontWeight: 500 }}
                    >
                        <LuPlus className="text-sm" />
                        Create Link
                    </button>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 px-3 py-2 space-y-0.5">
                    <button
                        onClick={() => setActiveTab("links")}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors"
                        style={activeTab === "links"
                            ? { background: "var(--g-blue-50)", color: "var(--g-blue-500)" }
                            : { color: "var(--g-text-secondary)" }}
                    >
                        <LuLink className="text-base flex-shrink-0" />
                        <span style={{ fontFamily: "var(--g-font)", fontSize: "0.875rem", fontWeight: activeTab === "links" ? 500 : 400 }}>Links</span>
                    </button>

                    <button
                        onClick={() => setActiveTab("analytics")}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors hover:bg-[#f1f3f4]"
                        style={activeTab === "analytics"
                            ? { background: "var(--g-blue-50)", color: "var(--g-blue-500)" }
                            : { color: "var(--g-text-secondary)" }}
                    >
                        <LuActivity className="text-base flex-shrink-0" />
                        <span style={{ fontFamily: "var(--g-font)", fontSize: "0.875rem", fontWeight: activeTab === "analytics" ? 500 : 400 }}>Analytics</span>
                    </button>
                </nav>

                {/* Sidebar Footer */}
                <div className="px-3 pb-4 space-y-0.5 border-t pt-3" style={{ borderColor: "var(--g-border)" }}>
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-default transition-colors hover:bg-[#f1f3f4]" style={{ color: "var(--g-text-secondary)" }}>
                        <LuLifeBuoy className="text-base flex-shrink-0" />
                        <span style={{ fontFamily: "var(--g-font)", fontSize: "0.875rem", fontWeight: 400 }}>Support</span>
                    </div>
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors hover:bg-[#fce8e6]"
                        style={{ color: "var(--g-red-500)", fontFamily: "var(--g-font)", fontSize: "0.875rem", fontWeight: 400 }}
                    >
                        <LuLogOut className="text-base flex-shrink-0" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* ── Main Content ─────────────────────────────────────────── */}
            <div className="flex-1 flex flex-col overflow-hidden">

                {/* Top bar */}
                <header className="flex items-center justify-between px-8 py-5 border-b flex-shrink-0" style={{ borderColor: "var(--g-border)", background: "var(--g-surface)" }}>
                    <div>
                        <h1 style={{ fontFamily: "var(--g-font-display)", fontWeight: 700, fontSize: "1.5rem", color: "var(--g-text-primary)", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                            {activeTab === "links" ? "Your Links" : "Analytics"}
                        </h1>
                        <p style={{ fontFamily: "var(--g-font)", fontSize: "0.8125rem", color: "var(--g-text-secondary)", marginTop: 3 }}>
                            {activeTab === "links" ? "Manage and track your shortened URLs." : "Performance overview and link statistics."}
                        </p>
                    </div>

                    {/* Search — only visible on Links tab */}
                    {activeTab === "links" && (
                        <div className="relative w-64">
                            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: "var(--g-text-tertiary)" }} />
                            <input
                                type="text"
                                placeholder="Search links..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="g-input pl-9"
                                style={{ fontFamily: "var(--g-font)", height: 38, fontSize: "0.875rem" }}
                            />
                        </div>
                    )}
                </header>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-8 py-6">
                    {loader || isLoading ? (
                        <Loader />
                    ) : (
                        <div className="space-y-6 max-w-full">

                            {/* ── LINKS TAB ── */}
                            {activeTab === "links" && (
                                <>
                                    <div style={{ fontFamily: "var(--g-font-display)", fontSize: "0.9375rem", fontWeight: 600, color: "var(--g-text-primary)" }}>
                                        {filteredUrls.length} link{filteredUrls.length !== 1 ? "s" : ""}
                                    </div>

                                    {myShortenUrls.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center border rounded-xl py-14 px-6 text-center space-y-4" style={{ borderColor: "var(--g-border)", background: "var(--g-surface-alt)" }}>
                                            <div className="w-12 h-12 rounded-2xl border flex items-center justify-center" style={{ borderColor: "var(--g-border)", background: "var(--g-surface)", color: "var(--g-blue-500)" }}>
                                                <LuLink className="text-xl" />
                                            </div>
                                            <div>
                                                <p style={{ fontFamily: "var(--g-font-display)", fontSize: "1rem", fontWeight: 600, color: "var(--g-text-primary)" }}>No links yet</p>
                                                <p style={{ fontFamily: "var(--g-font)", fontSize: "0.8125rem", color: "var(--g-text-secondary)", marginTop: 4 }}>Create your first link to start tracking.</p>
                                            </div>
                                            <button onClick={() => setShortenPopUp(true)} className="g-btn-primary" style={{ height: 36, padding: "0 18px", borderRadius: 8, fontSize: "0.8125rem", fontFamily: "var(--g-font)" }}>
                                                Create Link
                                            </button>
                                        </div>
                                    ) : filteredUrls.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center border rounded-xl py-10 px-6 text-center" style={{ borderColor: "var(--g-border)" }}>
                                            <p style={{ fontFamily: "var(--g-font)", fontSize: "0.875rem", fontWeight: 500, color: "var(--g-text-primary)" }}>No matching links found</p>
                                            <p style={{ fontFamily: "var(--g-font)", fontSize: "0.8125rem", color: "var(--g-text-secondary)", marginTop: 4 }}>Try a different search query.</p>
                                        </div>
                                    ) : (
                                        <ShortenUrlList data={filteredUrls} onShowAnalytics={setSelectedAnalyticsUrl} refetch={refetch} />
                                    )}
                                </>
                            )}

                            {/* ── ANALYTICS TAB ── */}
                            {activeTab === "analytics" && (
                                <div className="space-y-6">
                                    {/* KPI Cards */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="group g-card p-5 flex items-center justify-between cursor-default">
                                            <div>
                                                <div style={{ fontFamily: "var(--g-font)", fontSize: "0.6875rem", fontWeight: 500, color: "var(--g-text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Total Links</div>
                                                <div style={{ fontFamily: "var(--g-font-display)", fontSize: "1.875rem", fontWeight: 700, color: "var(--g-text-primary)", letterSpacing: "-0.02em", lineHeight: 1, marginTop: 4 }}>{activeTotalLinks}</div>
                                            </div>
                                            <div className="w-9 h-9 rounded-lg flex items-center justify-center group-hover:bg-[#d2e3fc] transition-colors" style={{ background: "var(--g-blue-50)", color: "var(--g-blue-500)" }}>
                                                <LuLink className="text-base" />
                                            </div>
                                        </div>

                                        <div className="group g-card p-5 flex items-center justify-between cursor-default">
                                            <div>
                                                <div style={{ fontFamily: "var(--g-font)", fontSize: "0.6875rem", fontWeight: 500, color: "var(--g-text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Total Clicks</div>
                                                <div style={{ fontFamily: "var(--g-font-display)", fontSize: "1.875rem", fontWeight: 700, color: "var(--g-text-primary)", letterSpacing: "-0.02em", lineHeight: 1, marginTop: 4 }}>{activeTotalClicks}</div>
                                            </div>
                                            <div className="w-9 h-9 rounded-lg flex items-center justify-center group-hover:bg-[#ceead6] transition-colors" style={{ background: "var(--g-green-100)", color: "var(--g-green-500)" }}>
                                                <LuActivity className="text-base" />
                                            </div>
                                        </div>

                                        <div className="group g-card p-5 flex items-center justify-between cursor-default">
                                            <div>
                                                <div style={{ fontFamily: "var(--g-font)", fontSize: "0.6875rem", fontWeight: 500, color: "var(--g-text-secondary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>System Status</div>
                                                <div className="flex items-center gap-2" style={{ marginTop: 6 }}>
                                                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--g-green-500)", flexShrink: 0 }} />
                                                    <span style={{ fontFamily: "var(--g-font)", fontSize: "0.9375rem", fontWeight: 500, color: "var(--g-green-500)" }}>Operational</span>
                                                </div>
                                            </div>
                                            <div className="w-9 h-9 rounded-lg flex items-center justify-center group-hover:bg-[#fce8e6] transition-colors" style={{ background: "#fef9e7", color: "#f9ab00" }}>
                                                <LuCheck className="text-base" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Full-width Performance Chart */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <div style={{ fontFamily: "var(--g-font-display)", fontSize: "1rem", fontWeight: 600, color: "var(--g-text-primary)" }}>Performance Overview</div>
                                                <select
                                                    value={selectedLinkForAnalytics}
                                                    onChange={(e) => setSelectedLinkForAnalytics(e.target.value)}
                                                    className="g-input py-1 px-3 text-xs"
                                                    style={{ fontFamily: "var(--g-font)", height: 32, width: "auto", minWidth: 160, borderRadius: 8, borderColor: "var(--g-border)" }}
                                                >
                                                    <option value="all">All Links</option>
                                                    {myShortenUrls?.map(url => (
                                                        <option key={url.id} value={url.shortUrl}>
                                                            {url.shortUrl} ({url.clickCount} clicks)
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <span style={{ fontFamily: "var(--g-font)", fontSize: "0.6875rem", color: "var(--g-text-secondary)", border: "1px solid var(--g-border)", borderRadius: 6, padding: "3px 10px", background: "var(--g-surface-alt)", fontWeight: 500 }}>
                                                Last 12 Months
                                            </span>
                                        </div>
                                        <div className="g-card p-6 relative" style={{ height: 380 }}>
                                            {loadingSingleLink ? (
                                                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 bg-white/70 z-10">
                                                    <p style={{ fontFamily: "var(--g-font)", fontSize: "0.8125rem", color: "var(--g-text-secondary)" }}>Loading analytics data...</p>
                                                </div>
                                            ) : selectedLinkForAnalytics === "all" ? (
                                                <>
                                                    {totalClicks.length === 0 && (
                                                        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6">
                                                            <div className="w-9 h-9 rounded-xl mb-3 flex items-center justify-center" style={{ background: "var(--g-surface-alt)", color: "var(--g-text-tertiary)" }}>
                                                                <LuActivity className="text-base" />
                                                            </div>
                                                            <p style={{ fontFamily: "var(--g-font)", fontSize: "0.8125rem", fontWeight: 500, color: "var(--g-text-primary)" }}>No click data yet</p>
                                                            <p style={{ fontFamily: "var(--g-font)", fontSize: "0.75rem", color: "var(--g-text-secondary)", marginTop: 4 }}>Share your links to see performance data here.</p>
                                                        </div>
                                                    )}
                                                    <Graph graphData={totalClicks} />
                                                </>
                                            ) : (
                                                <>
                                                    {singleLinkAnalyticsData.length === 0 && (
                                                        <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6">
                                                            <div className="w-9 h-9 rounded-xl mb-3 flex items-center justify-center" style={{ background: "var(--g-surface-alt)", color: "var(--g-text-tertiary)" }}>
                                                                <LuActivity className="text-base" />
                                                            </div>
                                                            <p style={{ fontFamily: "var(--g-font)", fontSize: "0.8125rem", fontWeight: 500, color: "var(--g-text-primary)" }}>No click data yet</p>
                                                            <p style={{ fontFamily: "var(--g-font)", fontSize: "0.75rem", color: "var(--g-text-secondary)", marginTop: 4 }}>This link has not received any clicks yet.</p>
                                                        </div>
                                                    )}
                                                    <Graph graphData={singleLinkAnalyticsData} />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    )}
                </div>


            </div>

            {/* Modals */}
            <ShortenPopUp refetch={refetch} open={shortenPopUp} setOpen={setShortenPopUp} />

            <AnalyticsDrawer
                urlMapping={selectedAnalyticsUrl}
                token={token}
                onClose={() => setSelectedAnalyticsUrl(null)}
            />
        </div>
    )
}

export default DashboardLayout