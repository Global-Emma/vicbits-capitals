import React from "react";

export const VerifiedBadge = ({ size = 20, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    aria-label="Verified Account"
    className={`inline-block select-none align-middle ${className}`}
  >
    {/* Twitter Blue Starburst Background */}
    <path
      d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.97-.81-3.98s-2.59-1.27-3.98-.81C14.67 2.56 13.43 1.68 12 1.68s-2.67.88-3.34 2.19c-1.39-.46-2.97-.2-3.98.81s-1.27 2.59-.81 3.98C2.56 9.33 1.68 10.57 1.68 12s.88 2.67 2.19 3.34c-.46 1.39-.2 2.97.81 3.98s2.59 1.27 3.98.81c.67 1.31 1.91 2.19 3.34 2.19s2.67-.88 3.34-2.19c1.39.46 2.97.2 3.98-.81s1.27-2.59.81-3.98c1.31-.67 2.19-1.91 2.19-3.34z"
      fill="#1D9BF0"
    />
    {/* Inner White Checkmark */}
    <path
      d="M9.75 15.25L6.75 12.25L8.16 10.84L9.75 12.42L15.84 6.33L17.25 7.75L9.75 15.25Z"
      fill="#FFFFFF"
    />
  </svg>
);