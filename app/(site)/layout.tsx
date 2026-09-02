import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { CommandPalette } from "@/components/site/command-palette";
import { getRecipes, getTechniques } from "@/lib/content";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [recipes, techniques] = await Promise.all([
    getRecipes(),
    getTechniques(),
  ]);

  const searchRecipes = recipes.map((r) => ({
    _id: r._id,
    slug: r.slug,
    title: r.title,
    dishType: r.dishType,
    cuisine: r.cuisine,
  }));

  return (
    <CommandPalette
      recipes={searchRecipes as never}
      techniques={techniques}
    >
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </CommandPalette>
  );
}
