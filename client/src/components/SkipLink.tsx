export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[hsl(75,64%,49%)] focus:text-black focus:rounded-md focus:font-medium focus:shadow-lg"
      data-testid="skip-link"
    >
      Skip to main content
    </a>
  );
}
