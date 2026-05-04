export function Captcha() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3">
      <input
        type="checkbox"
        disabled
        className="h-5 w-5 cursor-not-allowed rounded border-gray-300"
      />
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-700">
          I&apos;m not a robot
        </p>
        <p className="text-xs text-gray-500">reCAPTCHA</p>
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <img
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z'/%3E%3C/svg%3E"
          alt="reCAPTCHA"
          className="h-6 w-6 text-gray-400"
        />
        <p className="text-[10px] text-gray-400">Privacy - Terms</p>
      </div>
    </div>
  );
}
