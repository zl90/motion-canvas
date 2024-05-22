import {Circle, Layout, makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import {all, waitFor, makeRef, range, createRef, chain} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  const rects: Rect[] = [];
  const grid = createRef<Layout>();
  const gap = 110;
  const gridWidth = 8;
  const gridHeight = 8;

  const gridInitialisationTime = 0.1;

  const backgroundColour = '#1a1a2e';
  const gridCellBackgroundColour = '#594f75';

  view.fill(backgroundColour);


  // Create some rects
  view.add(
    <Layout ref={grid} children={
      range(gridWidth * gridHeight).map((i) => (
          <Rect
          ref={makeRef(rects, i)}
          width={30}
          height={30}
          x={-(3.5) * gap + i % gridWidth  * gap}
          y={-(3.5) * gap + Math.floor(i / gridHeight)  * gap}        
          fill={gridCellBackgroundColour}
          radius={10}
          opacity={0}
        />
      ))
    } />
  );


  yield* waitFor(1);

  // Animate them
  yield* chain(
    ...rects.map(rect => {
      return all(rect.opacity(1, gridInitialisationTime), rect.width(100, gridInitialisationTime), rect.height(100, gridInitialisationTime))
    }),
  );

  yield* waitFor(1);


  // const generators = [];
  // for (const rect of rects) {
  //   // No yield here, just store the generators.
  //   generators.push(rect.position.y(100, 1).to(-100, 2).to(0, 1));
  // }

  // // Run all of the generators.
  // yield * all(...generators);
});