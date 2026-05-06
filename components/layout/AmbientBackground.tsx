export function AmbientBackground() {
  return (
    <div aria-hidden className="fixed inset-0 z-[-1] bg-background overflow-hidden pointer-events-none">
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-secondary-container/15 blur-[140px]" />
      <div className="absolute top-[30%] left-[40%] w-[35vw] h-[35vw] rounded-full bg-tertiary/15 blur-[100px]" />
    </div>
  );
}
