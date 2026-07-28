interface EyeIconProps {
  isVisible: boolean;
}

/** Small presentational icon; swapped based on visibility state. */
export function EyeIcon({ isVisible }: EyeIconProps) {
  if (isVisible) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3 12s3.6-7 9-7 9 7 9 7-3.6 7-9 7-9-7-9-7Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    );
  }

  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.24 4.24M6.6 6.7C4.4 8.1 3 10 3 12c0 0 3.6 7 9 7 1.8 0 3.4-.5 4.7-1.3M9.9 4.2A10.4 10.4 0 0 1 12 4c5.4 0 9 7 9 7-.4.8-1.4 2.4-2.9 3.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
