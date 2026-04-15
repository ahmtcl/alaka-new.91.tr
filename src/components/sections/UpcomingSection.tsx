export function UpcomingSection() {
  return (
    <section className="relative overflow-hidden bg-light -mb-px">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="w-full block"
        style={{ objectFit: 'cover', marginTop: '-1px', marginBottom: '-1px' }}
      >
        <source src="/videos/4.mp4" type="video/mp4" />
      </video>
    </section>
  );
}
