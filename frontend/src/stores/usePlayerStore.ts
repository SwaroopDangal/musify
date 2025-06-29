import type { Song } from "@/types";
import { create } from "zustand";
import { useChatStore } from "./useChatStore";

type RepeatMode = "none" | "all" | "one";

interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;
  isShuffling: boolean;
  isRepeating: boolean;
  repeatMode: RepeatMode;

  initializeQueue: (songs: Song[]) => void;
  playAlbum: (songs: Song[], startIndex?: number) => void;
  togglePlay: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setCurrentSong: (song: Song | null) => void;
  playNext: (forced: boolean) => void;
  playPrevious: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1,
  isShuffling: false,
  isRepeating: false,
  repeatMode: "none",

  initializeQueue: (songs: Song[]) => {
    set({
      queue: songs,
      currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
      currentSong: get().currentSong || songs[0],
    });
  },
  playAlbum: (songs: Song[], startIndex = 0) => {
    if (songs.length === 0) return;

    const song = songs[startIndex];

    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }
    set({
      queue: songs,
      currentIndex: startIndex,
      currentSong: song,
      isPlaying: true,
    });
  },
  setCurrentSong: (song: Song | null) => {
    if (!song) return;
    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity: `Playing ${song.title} by ${song.artist}`,
      });
    }

    const songIndex = get().queue.findIndex((s) => s._id === song._id);
    set({
      currentSong: song,
      isPlaying: true,
      currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
    });
  },
  togglePlay: () => {
    const willStartPlaying = !get().isPlaying;

    const currentSong = get().currentSong;
    const socket = useChatStore.getState().socket;
    if (socket.auth) {
      socket.emit("update_activity", {
        userId: socket.auth.userId,
        activity:
          willStartPlaying && currentSong
            ? `Playing ${currentSong.title} by ${currentSong.artist}`
            : "idle",
      });
    }

    set({
      isPlaying: willStartPlaying,
    });
  },
  playNext: (forced = false) => {
    const { currentIndex, queue } = get();

    let nextIndex: number;
    if (forced) {
      if (get().isShuffling) {
        const availableIndices = queue
          .map((_, i) => i)
          .filter((i) => i !== currentIndex);
        nextIndex =
          availableIndices[Math.floor(Math.random() * availableIndices.length)];
      } else {
        nextIndex = currentIndex + 1;
      }
    } else {
      if (get().repeatMode === "one") {
        nextIndex = currentIndex;
      } else if (get().isShuffling) {
        const availableIndices = queue
          .map((_, i) => i)
          .filter((i) => i !== currentIndex);
        nextIndex =
          availableIndices[Math.floor(Math.random() * availableIndices.length)];
      } else {
        nextIndex = currentIndex + 1;
      }
    }

    if (nextIndex < queue.length) {
      const nextSong = queue[nextIndex];
      const socket = useChatStore.getState().socket;
      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: `Playing ${nextSong.title} by ${nextSong.artist}`,
        });
      }
      set({
        currentSong: nextSong,
        currentIndex: nextIndex,
        isPlaying: true,
      });
    } else {
      if (get().repeatMode === "all") {
        // Loop back to start
        const firstSong = queue[0];
        const socket = useChatStore.getState().socket;
        if (socket.auth) {
          socket.emit("update_activity", {
            userId: socket.auth.userId,
            activity: `Playing ${firstSong.title} by ${firstSong.artist}`,
          });
        }
        set({
          currentSong: firstSong,
          currentIndex: 0,
          isPlaying: true,
        });
      } else {
        set({ isPlaying: false });
        const socket = useChatStore.getState().socket;
        if (socket.auth) {
          socket.emit("update_activity", {
            userId: socket.auth.userId,
            activity: "idle",
          });
        }
      }
    }
  },
  playPrevious: () => {
    const { currentIndex, queue } = get();

    let prevIndex: number;

    if (get().isShuffling) {
      const availableIndices = queue
        .map((_, i) => i)
        .filter((i) => i !== currentIndex);
      prevIndex =
        availableIndices[Math.floor(Math.random() * availableIndices.length)];
    } else {
      prevIndex = currentIndex - 1;
    }
    if (prevIndex >= 0) {
      const prevSong = queue[prevIndex];
      const socket = useChatStore.getState().socket;
      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: `Playing ${prevSong.title} by ${prevSong.artist}`,
        });
      }
      set({
        currentSong: prevSong,
        currentIndex: prevIndex,
        isPlaying: true,
      });
    } else {
      set({ isPlaying: false });
      const socket = useChatStore.getState().socket;
      if (socket.auth) {
        socket.emit("update_activity", {
          userId: socket.auth.userId,
          activity: "idle",
        });
      }
    }
  },
  toggleShuffle: () => set((state) => ({ isShuffling: !state.isShuffling })),
  toggleRepeat: () => {
    const { repeatMode } = get();
    let newMode: RepeatMode;

    if (repeatMode === "none") newMode = "all";
    else if (repeatMode === "all") newMode = "one";
    else newMode = "none";

    set({ repeatMode: newMode });
  },
}));
