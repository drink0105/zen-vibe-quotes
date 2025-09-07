import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { 
  MdPlaylistAdd, 
  MdPlayArrow, 
  MdEdit, 
  MdDelete,
  MdAdd,
  MdClose,
  MdShuffle
} from "react-icons/md";

interface Quote {
  id: number;
  text: string;
  author?: string;
  category: string;
  tier: "free" | "premium";
}

interface Playlist {
  id: string;
  name: string;
  quotes: Quote[];
  createdAt: string;
}

interface PlaylistPageProps {
  isPremium: boolean;
  allQuotes: Quote[];
}

export function PlaylistPage({ isPremium, allQuotes }: PlaylistPageProps) {
  const [playlists, setPlaylists] = useLocalStorage<Playlist[]>("playlists", []);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [selectedQuotes, setSelectedQuotes] = useState<Quote[]>([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<{playlistId: string, quoteIndex: number} | null>(null);

  const maxQuotes = isPremium ? 10 : 5;
  const maxPlaylists = isPremium ? Infinity : 1;

  const createPlaylist = () => {
    if (!isPremium && playlists.length >= maxPlaylists) {
      alert("Free tier allows only 1 playlist. Upgrade to Premium for unlimited playlists!");
      return;
    }

    if (selectedQuotes.length === 0) {
      alert("Please select at least one quote for your playlist.");
      return;
    }

    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name: newPlaylistName || `Playlist ${playlists.length + 1}`,
      quotes: selectedQuotes,
      createdAt: new Date().toISOString(),
    };

    setPlaylists([...playlists, newPlaylist]);
    setShowCreateModal(false);
    setNewPlaylistName("");
    setSelectedQuotes([]);
  };

  const deletePlaylist = (id: string) => {
    setPlaylists(playlists.filter(p => p.id !== id));
  };

  const playPlaylist = (playlist: Playlist) => {
    setCurrentlyPlaying({ playlistId: playlist.id, quoteIndex: 0 });
  };

  const nextQuote = () => {
    if (!currentlyPlaying) return;
    
    const playlist = playlists.find(p => p.id === currentlyPlaying.playlistId);
    if (!playlist) return;

    const nextIndex = (currentlyPlaying.quoteIndex + 1) % playlist.quotes.length;
    setCurrentlyPlaying({ ...currentlyPlaying, quoteIndex: nextIndex });
  };

  const toggleQuoteSelection = (quote: Quote) => {
    if (selectedQuotes.find(q => q.id === quote.id)) {
      setSelectedQuotes(selectedQuotes.filter(q => q.id !== quote.id));
    } else {
      if (selectedQuotes.length >= maxQuotes) {
        alert(`${isPremium ? 'Premium' : 'Free'} tier allows max ${maxQuotes} quotes per playlist.`);
        return;
      }
      setSelectedQuotes([...selectedQuotes, quote]);
    }
  };

  const categories = Array.from(new Set(allQuotes.map(q => q.category)));
  const availableQuotes = allQuotes.filter(q => isPremium || q.tier === "free");

  const currentPlayingQuote = currentlyPlaying ? 
    playlists.find(p => p.id === currentlyPlaying.playlistId)?.quotes[currentlyPlaying.quoteIndex] : null;

  return (
    <div className="min-h-screen pb-32 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <MdPlaylistAdd className="w-16 h-16 mx-auto mb-4 text-primary animate-glow-pulse" />
          <h1 className="text-3xl font-bold mb-2">Mood Playlists</h1>
          <p className="text-muted-foreground">
            Create custom collections of your favorite quotes
          </p>
        </div>

        {/* Currently Playing */}
        {currentPlayingQuote && (
          <div className="glass-card p-6 mb-6 gradient-creativity">
            <div className="text-center text-white">
              <h3 className="text-lg font-semibold mb-4 flex items-center justify-center gap-2">
                <MdPlayArrow className="w-5 h-5" />
                Now Playing
              </h3>
              <blockquote className="text-xl font-quote mb-4">
                "{currentPlayingQuote.text}"
              </blockquote>
              {currentPlayingQuote.author && (
                <p className="text-white/80 mb-4">— {currentPlayingQuote.author}</p>
              )}
              <div className="flex justify-center gap-4">
                <Button 
                  onClick={nextQuote}
                  variant="outline"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  Next Quote
                </Button>
                <Button 
                  onClick={() => setCurrentlyPlaying(null)}
                  variant="outline"
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  <MdClose className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Create New Playlist Button */}
        <div className="mb-6 text-center">
          <Button 
            onClick={() => setShowCreateModal(true)}
            variant="zen"
            size="lg"
            className="glow-primary"
          >
            <MdAdd className="w-5 h-5 mr-2" />
            Create New Playlist
          </Button>
        </div>

        {/* Existing Playlists */}
        <div className="grid gap-4 md:grid-cols-2">
          {playlists.length === 0 ? (
            <div className="col-span-full glass-card p-8 text-center">
              <MdPlaylistAdd className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No playlists created yet</p>
            </div>
          ) : (
            playlists.map((playlist) => (
              <div key={playlist.id} className="glass-card p-6 tilt-3d">
                <h3 className="text-lg font-semibold mb-2">{playlist.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {playlist.quotes.length} quotes
                </p>
                
                <div className="flex gap-2 mb-4">
                  <Button 
                    onClick={() => playPlaylist(playlist)}
                    variant="zen" 
                    size="sm"
                  >
                    <MdPlayArrow className="w-4 h-4 mr-1" />
                    Play
                  </Button>
                  <Button 
                    onClick={() => setEditingPlaylist(playlist)}
                    variant="outline" 
                    size="sm"
                  >
                    <MdEdit className="w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={() => deletePlaylist(playlist.id)}
                    variant="destructive" 
                    size="sm"
                  >
                    <MdDelete className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {playlist.quotes.slice(0, 2).map((quote) => (
                    <p key={quote.id} className="text-sm text-muted-foreground truncate">
                      "{quote.text}"
                    </p>
                  ))}
                  {playlist.quotes.length > 2 && (
                    <p className="text-xs text-muted-foreground">
                      +{playlist.quotes.length - 2} more...
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create/Edit Modal */}
        {(showCreateModal || editingPlaylist) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-card max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
              <h3 className="text-xl font-semibold mb-4">
                {editingPlaylist ? 'Edit Playlist' : 'Create New Playlist'}
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Playlist Name</label>
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  placeholder="My Motivation Mix"
                  className="glass-button w-full p-3 rounded-lg border text-foreground"
                />
              </div>

              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Selected: {selectedQuotes.length}/{maxQuotes} quotes
                </p>
              </div>

              <div className="space-y-4 mb-6">
                {categories.map(category => {
                  const categoryQuotes = availableQuotes.filter(q => q.category === category);
                  return (
                    <div key={category}>
                      <h4 className="font-medium mb-2">{category}</h4>
                      <div className="grid gap-2">
                        {categoryQuotes.slice(0, 5).map(quote => (
                          <div 
                            key={quote.id}
                            onClick={() => toggleQuoteSelection(quote)}
                            className={`
                              p-3 rounded-lg border cursor-pointer transition-all duration-200
                              ${selectedQuotes.find(q => q.id === quote.id) 
                                ? 'bg-primary/20 border-primary' 
                                : 'glass-button hover:scale-105'
                              }
                            `}
                          >
                            <p className="text-sm">{quote.text}</p>
                            {quote.author && (
                              <p className="text-xs text-muted-foreground mt-1">— {quote.author}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-4">
                <Button onClick={createPlaylist} variant="zen" className="flex-1">
                  {editingPlaylist ? 'Update' : 'Create'} Playlist
                </Button>
                <Button 
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingPlaylist(null);
                    setSelectedQuotes([]);
                    setNewPlaylistName("");
                  }}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Premium upsell */}
        {!isPremium && (
          <div className="glass-card p-6 mt-6 text-center gradient-creativity">
            <h3 className="text-lg font-semibold mb-2 text-white">Go Premium</h3>
            <p className="text-white/90 text-sm mb-4">
              Unlock unlimited playlists, 10 quotes per playlist, and access to all premium quotes
            </p>
            <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
              Upgrade for $2.99
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
