import Image from "next/image";
import { DishArt } from "@/components/dish-art";
import type { DishType } from "@/lib/types";

/*
  Renders a real photo when the CMS provides one, otherwise falls back to the
  generative DishArt so no recipe is ever missing a hero.
*/
export function RecipeImage({
  src,
  alt,
  slug,
  dishType,
  className,
  priority,
  sizes = "100vw",
}: {
  src: string;
  alt: string;
  slug: string;
  dishType: DishType;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (src && src.startsWith("http")) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={className ?? "object-cover"}
      />
    );
  }
  return (
    <div className={className ?? "absolute inset-0"}>
      <DishArt slug={slug} dishType={dishType} />
    </div>
  );
}
