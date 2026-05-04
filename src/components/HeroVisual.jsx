export default function HeroVisual() {
  return (
    <div className="hero-visual-shell" aria-hidden="true">
      <div className="hero-stage-ring" />
      <div className="hero-floating-dot hero-dot-a" />
      <div className="hero-floating-dot hero-dot-b" />
      <div className="hero-floating-dot hero-dot-c" />

      <div className="clipboard-scene">
        <div className="clipboard-clip" />
        <div className="clipboard-body">
          <div className="clipboard-line short" />
          <div className="clipboard-line" />
          <div className="clipboard-check" />
          <div className="clipboard-line medium" />
          <div className="clipboard-check" />
          <div className="clipboard-line short" />
        </div>
      </div>

      <div className="book-stack">
        <div className="book-card book-top" />
        <div className="book-card book-bottom" />
      </div>

      <div className="trophy-piece">
        <div className="trophy-cup" />
        <div className="trophy-base" />
      </div>

      <div className="hero-platform" />
    </div>
  );
}
