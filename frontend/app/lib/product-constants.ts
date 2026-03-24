export const productImages: Record<number, string> = {
  1: "/images/1.png",
  2: "/images/2.png",
  3: "/images/3.png",
  4: "/images/4.png",
};

export const getProductImage = (id: number): string => {
  return productImages[id] || "/images/1.png";
};
