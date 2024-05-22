import { Circle, Layout, makeScene2D, Rect, Txt } from "@motion-canvas/2d";
import {
  all,
  waitFor,
  makeRef,
  range,
  createRef,
  chain,
} from "@motion-canvas/core";

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export default makeScene2D(function* (view) {
  const rects: Rect[] = [];
  const texts: Txt[] = [];
  const grid = createRef<Layout>();
  const gap = 110;
  const gridWidth = 8;
  const gridHeight = 8;

  const gridInitialisationTime = 0.05;

  const backgroundColour = "#1a1a2e";
  const gridCellBackgroundColour = "#594f75";
  const gridCellCompleteBackgroundColour = "#796a94";
  const selectedGridCellBackgroundColour = "#dba456";
  const textColourLowest = "#25257d";
  const textColourLow = "#69ff8e";
  const textColourMedium = "#69ff8e";
  const textColourHigh = "#ffd469";
  const textColourHighest = "#f70f0f";

  view.fill(backgroundColour);

  // Create some rects
  view.add(
    <Layout
      ref={grid}
      children={range(gridWidth * gridHeight).map((i) => (
        <Rect
          ref={makeRef(rects, i)}
          width={30}
          height={30}
          x={-3.5 * gap + (i % gridWidth) * gap}
          y={-3.5 * gap + Math.floor(i / gridHeight) * gap}
          fill={gridCellBackgroundColour}
          radius={10}
          opacity={0}
          layout
          justifyContent={"center"}
          alignItems={"center"}
          paddingTop={8}
        >
          <Txt
            fill={textColourLowest}
            opacity={0}
            ref={makeRef(texts, i)}
            fontSize={12}
          >
            0.0
          </Txt>
        </Rect>
      ))}
    />
  );

  yield* waitFor(1);

  // "Initialise" the grid cells
  yield* chain(
    ...rects.map((rect) => {
      return all(
        rect.opacity(1, gridInitialisationTime),
        rect.width(100, gridInitialisationTime),
        rect.height(100, gridInitialisationTime)
      );
    })
  );

  // "Complete" the grid (set the background colour of all cells)
  yield* all(
    ...rects.map((rect) => rect.fill(gridCellCompleteBackgroundColour, 0.3))
  );

  yield* waitFor(0.5);

  // Initialise the text inside the grid cells
  yield* all(
    ...texts.map((text) => {
      return all(text.opacity(1, 0.4), text.fontSize(40, 0.4));
    })
  );

  yield* waitFor(0.5);

  // Iterate through the grid
  yield* chain(
    ...rects.map((rect, i) => {
      const shouldInsertHotspot = getRandomInt(10) <= 0;
      return chain(
        all(
          rect.height(105, 0.1),
          rect.width(105, 0.1),
          rect.fill(selectedGridCellBackgroundColour, 0.1).wait(0.03),
          texts[i].text(shouldInsertHotspot ? "1.0" : "0.0", 0.1),
          texts[i].fill(
            shouldInsertHotspot ? textColourHighest : textColourLowest,
            0.1
          )
        ),
        all(
          rect.height(100, 0.3),
          rect.width(100, 0.3),
          rect.fill(
            shouldInsertHotspot ? "#540e0e" : gridCellCompleteBackgroundColour,
            0.3
          )
        )
      );
    })
  );

  yield* waitFor(1);
});
