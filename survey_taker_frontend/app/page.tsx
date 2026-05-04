export default function Home() {
  return (
    <main className="min-h-screen bg-cream">
      <div className="container mx-auto px-8 pt-32 pb-32">
        <div className="max-w-4xl">
          <h1 className="text-6xl font-bold text-text-primary leading-tight font-cormorant mb-6">
            Earn Money by{" "}
            <span className="text-[#6A8C78]">Sharing</span>{" "}
            Your Opinion
          </h1>
          <h3>
            Transforms your insight into accurate rewards.
          </h3>
          <div className = "flex gap-4 mt-6">
          <button className="btn-primary font-dm">
            GET STARTED
          </button>
          
          <button className="btn-secondary font-dm">
            How it works
          </button>
          </div>

        </div>
      </div>
    </main>
  );
}