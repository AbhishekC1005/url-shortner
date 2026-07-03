import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CopyToClipboard from 'react-copy-to-clipboard';
import { LuCopy, LuCheck, LuActivity, LuTrash2, LuExternalLink, LuMousePointerClick } from 'react-icons/lu';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { useStoreContext } from '../../contextApi/ContextApi';
import api from '../../api/api';

const ShortenItem = ({ id, originalUrl, shortUrl, clickCount, createdDate, expiresAt, onShowAnalytics, refetch }) => {
    const { token } = useStoreContext();
    const [isCopied, setIsCopied] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const copyHandler = () => {
        setIsCopied(true);
        toast.success("Short URL copied!");
        setTimeout(() => setIsCopied(false), 2000);
    };

    const deleteHandler = async () => {
        if (!window.confirm("Are you sure you want to delete this shortened URL?")) {
            return;
        }
        setIsDeleting(true);
        try {
            await api.delete(`/api/urls/delete/${shortUrl}`, {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: "Bearer " + token,
                },
            });
            toast.success("Short URL deleted successfully!");
            if (refetch) refetch();
        } catch (error) {
            console.error("Failed to delete URL", error);
            toast.error("Failed to delete shortened URL.");
        } finally {
            setIsDeleting(false);
        }
    };

    const shortLink = `${window.location.host}/s/${shortUrl}`;
    const fullShortUrl = `${import.meta.env.VITE_REACT_FRONT_END_URL}/s/${shortUrl}`;

    return (
        <div
            className="group g-card p-4 flex flex-col gap-3 cursor-default"
        >
            {/* Top row: short URL + click badge */}
            <div className="flex items-start justify-between gap-2">
                <Link
                    target="_blank"
                    to={fullShortUrl}
                    className="text-sm font-semibold hover:underline truncate"
                    style={{ color: "var(--g-blue-500)", fontFamily: "var(--g-font)", maxWidth: "70%" }}
                >
                    {shortLink}
                </Link>
                <div className="flex items-center gap-1 flex-shrink-0 rounded-full px-2 py-0.5" style={{ background: "var(--g-blue-50)" }}>
                    <LuMousePointerClick className="text-[11px]" style={{ color: "var(--g-blue-500)" }} />
                    <span style={{ fontFamily: "var(--g-font)", fontSize: "0.6875rem", fontWeight: 600, color: "var(--g-blue-600)" }}>
                        {clickCount.toLocaleString()}
                    </span>
                </div>
            </div>

            {/* Original URL */}
            <p
                className="truncate"
                title={originalUrl}
                style={{ fontFamily: "var(--g-font)", fontSize: "0.75rem", color: "var(--g-text-secondary)" }}
            >
                {originalUrl}
            </p>

            {/* Bottom row: date + actions */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-0.5">
                    <span style={{ fontFamily: "var(--g-font)", fontSize: "0.6875rem", color: "var(--g-text-tertiary)" }}>
                        Created {dayjs(createdDate).format("MMM DD, YYYY")}
                    </span>
                    {expiresAt && (
                        <span style={{ fontFamily: "var(--g-font)", fontSize: "0.625rem", color: "var(--g-text-tertiary)" }}>
                            Expires {dayjs(expiresAt).format("MMM DD, YYYY")}
                        </span>
                    )}
                </div>

                {/* Action buttons — always visible, compact */}
                <div className="flex items-center gap-1">
                    {/* Open in new tab */}
                    <Link
                        target="_blank"
                        to={fullShortUrl}
                        className="p-1.5 rounded-lg transition-colors hover:bg-[#f1f3f4]"
                        title="Open link"
                        style={{ color: "var(--g-text-secondary)" }}
                    >
                        <LuExternalLink className="text-[13px]" />
                    </Link>

                    {/* Copy */}
                    <CopyToClipboard onCopy={copyHandler} text={fullShortUrl}>
                        <button
                            title="Copy short URL"
                            className="p-1.5 rounded-lg transition-colors hover:bg-[#f1f3f4]"
                            style={{ color: isCopied ? "var(--g-green-500)" : "var(--g-text-secondary)" }}
                        >
                            {isCopied ? <LuCheck className="text-[13px]" /> : <LuCopy className="text-[13px]" />}
                        </button>
                    </CopyToClipboard>


                    {/* Delete */}
                    <button
                        title={isDeleting ? "Deleting..." : "Delete URL"}
                        onClick={deleteHandler}
                        disabled={isDeleting}
                        className={`p-1.5 rounded-lg transition-colors ${isDeleting ? "opacity-50 cursor-not-allowed" : "hover:bg-[#fce8e6]"}`}
                        style={{ color: "var(--g-red-500)" }}
                    >
                        <LuTrash2 className="text-[13px]" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShortenItem;
