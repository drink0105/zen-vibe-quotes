import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { 
  MdPlaylistAdd, 
  MdAdd, 
  MdDelete, 
  MdPlayArrow, 
  MdArrowForward,
  MdClose
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
  createdAt: number;
}

interface PlaylistsPageProps {
  allQuotes: Quote[];
  isPremium: boolean;
}

export default function PlaylistsPage({ allQuotes, isPremium }: PlaylistsPageProps) {
  const [playlists, setPlaylists] = useLocalStorage<Playlist[]>("zenvibes-playlists", []);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<Playlist | null>(null);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [selectedQuotes, setSelectedQuotes] = useState<Quote[]>([]);

  const createPlaylist = () => {
    if (!newPlaylistName.trim()) return;
    
    if (!isPremium && playlists.length >= 1) {
      alert("Free tier allows only 1 playlist. Upgrade to Premium for unlimited playlists!");
      return;
    }

    const maxQuotes = isPremium ? 10 : 5;
    if (selectedQuotes.length === 0 || selectedQuotes.length > maxQuotes) {
      alert(`Please select 1-${maxQuotes} quotes for your playlist.`);
      return;
    }

    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name: newPlaylistName,
      quotes: selectedQuotes,
      createdAt: Date.now(),
    };

    setPlaylists([...playlists, newPlaylist]);
    setNewPlaylistName("");
    setSelectedQuotes([]);
    setShowCreateModal(false);
  };

  const deletePlaylist = (id: string) => {
    setPlaylists(playlists.filter(p => p.id !== id));
    if (currentlyPlaying?.id === id) {
      setCurrentlyPlaying(null);
      setCurrentQuoteIndex(0);
    }
  };

  const playPlaylist = (playlist: Playlist) => {
    setCurrentlyPlaying(playlist);
    setCurrentQuoteIndex(0);
  };

  const nextQuote = () => {
    if (!currentlyPlaying) return;
    
    const nextIndex = (currentQuoteIndex + 1) % currentlyPlaying.quotes.length;
    setCurrentQuoteIndex(nextIndex);
  };

  const toggleQuoteSelection = (quote: Quote) => {
    const maxQuotes = isPremium ? 10 : 5;
    const isSelected = selectedQuotes.some(q => q.id === quote.id);
    
    if (isSelected) {
      setSelectedQuotes(selectedQuotes.filter(q => q.id !== quote.id));
    } else {
      if (selectedQuotes.length >= maxQuotes) {
        alert(`You can select up to ${maxQuotes} quotes per playlist.`);
        return;
      }
      setSelectedQuotes([...selectedQuotes, quote]);
    }
  };

  const availableQuotes = isPremium ? allQuotes : allQuotes.filter(q => q.tier === "free");

  return (
    <div className="min-h-screen pb-32 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <MdPlaylistAdd className="w-16 h-16 mx-auto mb-4 text-primary animate-glow-pulse" />
          <h1 className="text-3xl font-bold mb-2">Quote Playlists</h1>
          <p className="text-muted-foreground">
            Create custom collections of your favorite quotes
          </p>
        </div>

        {/* Currently Playing */}
        {currentlyPlaying && (
          <div className="glass-card p-6 mb-6 gradient-creativity">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Now Playing: {currentlyPlaying.name}</h3>
              <Button
                onClick={() => setCurrentlyPlaying(null)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <MdClose className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="mb-4">
              <blockquote className="text-lg mb-2 leading-relaxed font-quote text-white">
                "{currentlyPlaying.quotes[currentQuoteIndex].text}"
              </blockquote>
              {currentlyPlaying.quotes[currentQuoteIndex].author && (
                <p className="text-sm text-white/80">
                  — {currentlyPlaying.quotes[currentQuoteIndex].author}
                </p>
              )}
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-white/80">
                {currentQuoteIndex + 1} of {currentlyPlaying.quotes.length}
              </span>
              <Button
                onClick={nextQuote}
                variant="outline"
                size="sm"
                className="bg-white/20 border-white/30 text-white hover:bg-white/30"
              >
                <MdArrowForward className="w-4 h-4 mr-2" />
                Next Quote
              </Button>
            </div>
          </div>
        )}

        {/* Create Playlist Button */}
        <div className="flex justify-center mb-6">
          <Button
            onClick={() => setShowCreateModal(true)}
            variant="zen"
            className="px-8"
          >
            <MdAdd className="w-4 h-4 mr-2" />
            Create Playlist
          </Button>
        </div>

        {/* Existing Playlists */}
        {playlists.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <MdPlaylistAdd className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No playlists created yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {playlists.map((playlist) => (
              <div key={playlist.id} className="glass-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{playlist.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {playlist.quotes.length} quotes
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => playPlaylist(playlist)}
                      variant="zen"
                      size="sm"
                    >
                      <MdPlayArrow className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => deletePlaylist(playlist.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <MdDelete className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Playlist Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Create Playlist</h3>
                <Button
                  onClick={() => {
                    setShowCreateModal(false);
                    setSelectedQuotes([]);
                    setNewPlaylistName("");
                  }}
                  variant="ghost"
                  size="sm"
                >
                  <MdClose className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Playlist Name</label>
                  <input
                    type="text"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    placeholder="My favorite quotes"
                    className="glass-button w-full p-3 rounded-lg border text-foreground"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Select Quotes ({selectedQuotes.length}/{isPremium ? 10 : 5})
                  </label>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {availableQuotes.slice(0, 20).map((quote) => {
                      const isSelected = selectedQuotes.some(q => q.id === quote.id);
                      return (
                        <div
                          key={quote.id}
                          onClick={() => toggleQuoteSelection(quote)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            isSelected 
                              ? 'bg-primary/20 border-primary' 
                              : 'bg-background/50 border-border hover:bg-background/70'
                          }`}
                        >
                          <p className="text-sm font-medium truncate">"{quote.text.slice(0, 60)}..."</p>
                          <p className="text-xs text-muted-foreground">{quote.category}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <Button
                  onClick={createPlaylist}
                  variant="zen"
                  className="w-full"
                  disabled={!newPlaylistName.trim() || selectedQuotes.length === 0}
                >
                  Create Playlist
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
              Unlock unlimited playlists, 10 quotes per playlist, and access to all premium content
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
