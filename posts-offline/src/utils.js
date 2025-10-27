export const sleep = (ms) => new Promise(r => setTimeout(r, ms));

export const nowIso = () => new Date().toISOString();

export const uuid = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0, v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

// Mapeo simple de autores por userId (JSONPlaceholder)
export const authors = {
  1: "Leanne Graham", 2: "Ervin Howell", 3: "Clementine Bauch",
  4: "Patricia Lebsack", 5: "Chelsey Dietrich", 6: "Mrs. Dennis",
  7: "Kurtis Weissnat", 8: "Nicholas Runolfsdottir", 9: "Glenna Reichert", 10: "Clementina DuBuque"
};