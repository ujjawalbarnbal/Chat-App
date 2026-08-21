import { useState, useEffect, useCallback } from "react";
import { GiphyFetch } from "@giphy/js-fetch-api";

const gf = new GiphyFetch(import.meta.env.VITE_GIPHY_API_KEY);

const GifPicker = ({ onSelect }) => {
  const [search, setSearch] = useState("");
  const [gifs, setGifs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchGifs = useCallback(async (query) => {
    setIsLoading(true);
    try {
      const { data } = query
  ? await gf.search(query, { limit: 24 })
  : await gf.trending({ limit: 24 });
      setGifs(data);
    } catch (error) {
      console.log("Error fetching GIFs:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGifs("");
  }, [fetchGifs]);

  return (
    <div className="w-80 bg-[#12122b] border border-white/10 rounded-xl p-3 shadow-xl">
      <div className="mb-2 flex gap-1.5">
  <input
    type="text"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        fetchGifs(search);
      }
    }}
    placeholder="Search GIFs..."
    className="flex-1 bg-[#0a0a1a] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
  />
  <button
    type="button"
    onClick={() => fetchGifs(search)}
    className="px-2.5 bg-white/10 rounded-lg text-xs text-white hover:bg-white/20"
  >
    Go
  </button>
</div>
      <div className="grid grid-cols-2 gap-1.5 max-h-80 overflow-y-auto">
        {isLoading ? (
          <p className="col-span-2 text-xs text-gray-500 text-center py-4">Loading...</p>
        ) : (
          gifs.map((gif) => (
            <button
              key={gif.id}
              type="button"
              onClick={() => onSelect(gif.images.fixed_height.url)}
              className="rounded-lg overflow-hidden hover:opacity-80 transition-opacity"
            >
              <img
                src={gif.images.fixed_height_small.url}
                alt={gif.title}
                className="w-full h-20 object-cover"
              />
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default GifPicker;