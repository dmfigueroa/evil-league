export default function Live({ isLive }: { isLive: boolean }) {
  if (!isLive) {
    return null;
  }

  return (
    <p className="text-lg my-2 bg-red-600 px-4 rounded-full font-bold">Live</p>
  );
}
