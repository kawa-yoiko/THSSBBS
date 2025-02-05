const stickerImage = {};

for (let i = 0; i < 40; i++)
  stickerImage[`Muniko_${i}`] = `/stickers/MunikoSH/${i}.png`;

const stickerName = {};

for (const [k, v] of Object.entries(stickerImage))
  stickerName[v] = k;

export {
  stickerImage,
  stickerName,
};
