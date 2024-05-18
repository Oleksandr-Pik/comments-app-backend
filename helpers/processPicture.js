import Jimp from "jimp";

const processPicture = async (path) => {
  const img = await Jimp.read(path);
  await img.resize(320, 240).writeAsync(path);
};

export default processPicture;
