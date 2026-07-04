import React, { useState } from 'react'
import { useStoreContext } from '../../contextApi/ContextApi';
import { useForm } from 'react-hook-form';
import TextField from '../TextField';
import { LuX, LuCopy, LuCheck } from 'react-icons/lu';
import api from '../../api/api';
import toast from 'react-hot-toast';
import CopyToClipboard from 'react-copy-to-clipboard';

const CreateNewShorten = ({ setOpen, refetch }) => {
  const { token } = useStoreContext();
  const [loading, setLoading] = useState(false);
  const [createdShortUrl, setCreatedShortUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      originalUrl: "",
    },
    mode: "onTouched",
  });

  const createShortUrlHandler = async (formData) => {
    setLoading(true);
    try {
      const { data: res } = await api.post("/api/urls/shorten", formData, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      });

      const shortenUrl = `${import.meta.env.VITE_BACKEND_URL}/${res.shortUrl}`;
      setCreatedShortUrl(shortenUrl);
      navigator.clipboard.writeText(shortenUrl);
      setIsCopied(true);
      toast.success("Short URL created and copied!");
      if (refetch) refetch();
      reset();
    } catch (error) {
      toast.error("Failed to create short URL");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCreatedShortUrl("");
    setIsCopied(false);
    setOpen(false);
  };

  return (
    <div className="sm:w-[460px] w-[92%] relative bg-white border border-[#E5E7EB] p-8 sm:p-10 rounded-2xl shadow-xl flex flex-col justify-between">
      {/* Close button */}
      {!loading && (
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 p-1.5 text-[#6B7280] hover:text-[#111827] hover:bg-[#FAFAFA] border border-transparent hover:border-[#E5E7EB] rounded-lg transition-colors"
        >
          <LuX className="text-xl" />
        </button>
      )}

      {createdShortUrl ? (
        /* Success Screen */
        <div className="space-y-6 text-center">
          <div className="w-12 h-12 rounded-full bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center mx-auto">
            <LuCheck className="text-2xl" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[#111827] tracking-tight">Short Link Generated</h2>
            <p className="text-sm text-[#6B7280] max-w-sm mx-auto font-normal">
              Your link is ready to share and track clicks.
            </p>
          </div>

          <div className="flex h-12 items-center justify-between px-4 bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl">
            <span className="text-sm font-semibold text-[#2563EB] truncate mr-2">
              {createdShortUrl}
            </span>
            <CopyToClipboard
              text={createdShortUrl}
              onCopy={() => {
                setIsCopied(true);
                toast.success("Copied to clipboard!");
              }}
            >
              <button className="p-1.5 text-[#6B7280] hover:text-[#111827] hover:bg-white border border-transparent hover:border-[#E5E7EB] rounded-lg transition-all">
                {isCopied ? <LuCheck className="text-base text-[#16A34A]" /> : <LuCopy className="text-base" />}
              </button>
            </CopyToClipboard>
          </div>

          <button
            onClick={handleClose}
            className="w-full h-12 bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] text-white font-semibold text-sm rounded-xl transition-all shadow-sm"
          >
            Done
          </button>
        </div>
      ) : (
        /* Input Form Screen */
        <form onSubmit={handleSubmit(createShortUrlHandler)} className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-[#111827] tracking-tight">Create Short Link</h2>
            <p className="text-sm text-[#6B7280] font-normal">
              Enter the original URL to generate a trackable link.
            </p>
          </div>

          <TextField
            label="Original URL"
            required
            id="originalUrl"
            placeholder="https://example.com/some-very-long-path"
            type="url"
            message="Valid URL is required"
            register={register}
            errors={errors}
          />

          <button
            disabled={loading}
            className="w-full h-12 bg-[#2563EB] hover:bg-[#1D4ED8] active:scale-[0.98] text-white font-semibold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center"
            type="submit"
          >
            {loading ? "Generating..." : "Generate Link"}
          </button>
        </form>
      )}
    </div>
  );
}

export default CreateNewShorten