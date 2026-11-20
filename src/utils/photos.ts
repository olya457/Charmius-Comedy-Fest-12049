import RNFS from 'react-native-fs';
const directory = `${RNFS.DocumentDirectoryPath}/challenge-photos`;
export async function persistPhoto(uri: string): Promise<string> {
  if (uri.startsWith(`file://${directory}/`)) {
    return uri;
  }
  await RNFS.mkdir(directory);
  const target = `${directory}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.jpg`;
  await RNFS.copyFile(uri.replace(/^file:\/\//, ''), target);
  return `file://${target}`;
}
export async function deletePhoto(uri?: string) {
  if (!uri?.startsWith(`file://${directory}/`)) {
    return;
  }
  try {
    await RNFS.unlink(uri.replace(/^file:\/\//, ''));
  } catch {}
}
