const TextField = ({
    label,
    id,
    type,
    errors,
    register,
    required,
    message,
    className,
    min,
    value,
    placeholder,
  }) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        <label
          htmlFor={id}
          className={`${className ? className : ""} text-[13px] font-medium text-[#111827]`}
        >
          {label}
        </label>
  
        <input
          type={type}
          id={id}
          placeholder={placeholder}
          className={`${
            className ? className : ""
          } h-12 px-4 border outline-none bg-[#FAFAFA] text-[#111827] placeholder-[#9CA3AF] rounded-xl transition-all duration-150 ${
            errors[id]?.message
              ? "border-[#DC2626] focus:border-[#DC2626] focus:ring-4 focus:ring-[#DC2626]/10"
              : "border-[#E5E7EB] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 focus:bg-white"
          }`}
          {...register(id, {
            required: { value: required, message },
            minLength: min
              ? { value: min, message: "Minimum 6 character is required" }
              : null,
  
            pattern:
              type === "email"
                ? {
                    value: /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+com+$/,
                    message: "Invalid email",
                  }
                : type === "url"
                ? {
                    value:
                      /^(https?:\/\/)?(([a-zA-Z0-9\u00a1-\uffff-]+\.)+[a-zA-Z\u00a1-\uffff]{2,})(:\d{2,5})?(\/[^\s]*)?$/,
                    message: "Please enter a valid url",
                  }
                : null,
          })}
        />
  
        {errors[id]?.message && (
          <p className="text-xs font-semibold text-rose-400 mt-1">
            {errors[id]?.message}*
          </p>
        )}
      </div>
    );
  };
  
  export default TextField;