
export const formatFileSize = (sizeInBytes: number) => {
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  let size = sizeInBytes;
  let unitIndex = 0;

  if(size == 1)
    return "1 Byte"

  // Use 1024 for binary conversion to match file managers
  while (size >= 1000 && unitIndex < units.length - 1) {
    size /= 1000;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};