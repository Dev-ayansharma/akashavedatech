import { useCallback, useState } from 'react';
import { Journey } from './components/Journey';
import { Lower } from './components/Lower';
import { Nav } from './components/Nav';
import { Product } from './components/Product';
import { statusColor } from './data/content';
import { productAt } from './data/products';
import { useSpotlight } from './hooks/useReveal';

// Plain links between pages: each product has its own URL (the host serves index.html for it).
const product = productAt(location.pathname);

export function App() {
  const [chapter, setChapter] = useState(0);
  const onChapter = useCallback((ci: number) => setChapter(ci), []);
  useSpotlight();

  if (product)
    return (
      <>
        <div className="scroll-progress" aria-hidden="true" />
        <Nav statusColor={statusColor(0)} />
        <Product page={product} />
      </>
    );
  return (
    <>
      <div className="scroll-progress" aria-hidden="true" />
      <Nav statusColor={statusColor(chapter)} activeChapter={chapter} />
      <main>
        <Journey onChapter={onChapter} />
        <Lower />
      </main>
    </>
  );
}
