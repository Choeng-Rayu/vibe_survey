interface SubmitProps {
  buttonText?: string;
}

export function Submit({ buttonText = "Submit" }: SubmitProps) {
  return (
    <div className="flex items-center justify-center">
      <button
        type="button"
        disabled
        className="rounded-full bg-[#7C9E8A] px-8 py-3 text-base font-medium text-white transition-opacity disabled:opacity-70"
      >
        {buttonText}
      </button>
    </div>
  );
}
