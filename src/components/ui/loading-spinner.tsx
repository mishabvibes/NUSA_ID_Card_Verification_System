interface LoadingSpinnerProps {
  className?: string
}

export function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <div className={`animate-spin rounded-full border-b-2 border-primary ${className || 'h-8 w-8'}`}></div>
  );
}
