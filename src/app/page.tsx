import { ImageCard } from "@/components/image-card";

const images = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  src: `https://picsum.photos/seed/${i + 1}/1200/800`,
  caption:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
}));

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex flex-col gap-8">
        {images.map((img) => (
          <ImageCard
            key={img.id}
            src={img.src}
            caption={img.caption}
          />
        ))}
      </div>
    </main>
  );
}
