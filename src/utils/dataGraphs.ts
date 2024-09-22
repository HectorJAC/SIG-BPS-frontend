const predefinedColors = [
  "red",
  "orange",
  "blue", 
  "yellow",
  "green",
  "purple",
  "gray"
];

export const getUniqueRandomColor = (usedColors: Set<string>): string => {
  const availableColors = predefinedColors.filter(color => !usedColors.has(color));
  const randomIndex = Math.floor(Math.random() * availableColors.length);
  const color = availableColors[randomIndex];
  usedColors.add(color);
  return color;
};

export const usedColors = new Set<string>();