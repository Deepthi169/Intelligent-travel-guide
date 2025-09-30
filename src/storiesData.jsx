// src/storiesData.js

// Using a simple function to generate random image URLs for demonstration
const getRandomImage = (id) => `https://picsum.photos/400/700?random=${id}`;

export const storiesData = [
  {
    id: 1,
    username: "TravelBug",
    profilePic: "https://i.pravatar.cc/150?u=1",
    images: [getRandomImage(1), getRandomImage(2), getRandomImage(3)],
  },
  {
    id: 2,
    username: "CityScapes",
    profilePic: "https://i.pravatar.cc/150?u=2",
    images: [getRandomImage(4), getRandomImage(5)],
  },
  {
    id: 3,
    username: "NatureLover",
    profilePic: "https://i.pravatar.cc/150?u=3",
    images: [getRandomImage(6), getRandomImage(7), getRandomImage(8), getRandomImage(9)],
  },
  {
    id: 4,
    username: "FoodieAdventures",
    profilePic: "https://i.pravatar.cc/150?u=4",
    images: [getRandomImage(10)],
  },
  {
    id: 5,
    username: "Wanderlust",
    profilePic: "https://i.pravatar.cc/150?u=5",
    images: [getRandomImage(11), getRandomImage(12)],
  },
  {
    id: 6,
    username: "MountainHigh",
    profilePic: "https://i.pravatar.cc/150?u=6",
    images: [getRandomImage(13), getRandomImage(14), getRandomImage(15)],
  },
  {
    id: 7,
    username: "BeachVibes",
    profilePic: "https://i.pravatar.cc/150?u=7",
    images: [getRandomImage(16), getRandomImage(17)],
  },
  {
    id: 8,
    username: "UrbanExplorer",
    profilePic: "https://i.pravatar.cc/150?u=8",
    images: [getRandomImage(18), getRandomImage(19), getRandomImage(20)],
  },
  {
    id: 9,
    username: "TrailRunner",
    profilePic: "https://i.pravatar.cc/150?u=9",
    images: [getRandomImage(21)],
  },
  {
    id: 10,
    username: "RoadTripper",
    profilePic: "https://i.pravatar.cc/150?u=10",
    images: [getRandomImage(22), getRandomImage(23)],
  },
  {
    id: 11,
    username: "SkyDiver",
    profilePic: "https://i.pravatar.cc/150?u=11",
    images: [getRandomImage(24), getRandomImage(25), getRandomImage(26)],
  },
  {
    id: 12,
    username: "HistoryBuff",
    profilePic: "https://i.pravatar.cc/150?u=12",
    images: [getRandomImage(27)],
  },
  {
    id: 13,
    username: "ArtCollector",
    profilePic: "https://i.pravatar.cc/150?u=13",
    images: [getRandomImage(28), getRandomImage(29)],
  },
  {
    id: 14,
    username: "MusicFest",
    profilePic: "https://i.pravatar.cc/150?u=14",
    images: [getRandomImage(30), getRandomImage(31), getRandomImage(32), getRandomImage(33)],
  },
  {
    id: 15,
    username: "LocalGuide",
    profilePic: "https://i.pravatar.cc/150?u=15",
    images: [getRandomImage(34), getRandomImage(35)],
  },
];