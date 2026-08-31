import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";


const missions = [
  // offensive
  { prefix: "25", code: "141700", label: "Ambush" },
  { prefix: "25", code: "151403", label: "Axis of Advance" },
  { prefix: "25", code: "152000", label: "Attack by fire position" },
  { prefix: "25", code: "270602", label: "Bypass (Difficult)" },
  { prefix: "25", code: "340200", label: "Breach" },
  { prefix: "25", code: "340500", label: "Clear" },
  { prefix: "25", code: "340600", label: "Counter Attack" },
  { prefix: "25", code: "341100", label: "Fix" },
  { prefix: "25", code: "341300", label: "Follow and Support" },
  { prefix: "25", code: "342300", label: "Seize" },
  { prefix: "25", code: "342700", label: "Cordon and Search" },
  { prefix: "25", code: "341500", label: "Isolate" },
  { prefix: "25", code: "342100", label: "Secure" },
  // defensive
  { prefix: "25", code: "151204", label: "Contain" },
  { prefix: "25", code: "151205", label: "Retain" },
  { prefix: "25", code: "340800", label: "Delay" },
  { prefix: "25", code: "342201", label: "Cover" },
  { prefix: "25", code: "342202", label: "Guard" },
  { prefix: "25", code: "342203", label: "Screen" },
  { prefix: "25", code: "341700", label: "Occupy" },
  { prefix: "25", code: "152600", label: "Area Defense"},
  // tac arrows
  { prefix: "25", code: "140603", label: "Friendly Supporting Attack" },
  { prefix: "25", code: "290700", label: "Ferry" },
  // tac lines
  { prefix: "25", code: "290100", label: "Obstacle Line" },
  { prefix: "25", code: "290101", label: "Mineline" },
  { prefix: "25", code: "290204", label: "Antitank Wall" },
  { prefix: "25", code: "290301", label: "Unspecified Wire" },
  { prefix: "25", code: "290302", label: "Single Fence Wire" },
  { prefix: "25", code: "290900", label: "Fortified Line" },
  { prefix: "25", code: "271100", label: "Bridge or Gap" },
  { prefix: "25", code: "110100", label: "Lima Boundary" },
  { prefix: "25", code: "330300", label: "Main Supply Route" },
];

// workaround for AddVersion10Symbols
const requiredForMsdToWork = new Set([
  "120200",
  "161800",
  "161800",
  "161800",
  "161800",
  "161800",
  "161800",
  "161800",
  "161800",
  "161800"
])

const dataDir = join(__dirname, "src/main/ts/armyc2/c5isr/data");
const exportDir = join(__dirname, "src/main/ts/armyc2/c5isr/data-light");

type MseSymbol = {
  ss: string;
  e: string;
  et: string;
  est: string;
  code: string;
};

type MseData = {
  mse: {
    SYMBOL: Array<MseSymbol>;
  };
    msd: {
    SYMBOL: Array<MseSymbol>;
  };
};

type SvgElement = {
  id: string;
  X: string;
  Y: string;
  Width: string;
  Height: string;
  SVG: string;
};

async function main() {

  const missionIDs = new Set(missions.map((m) => `${m.prefix}${m.code}`));

  const svgdContent = JSON.parse(
    await readFile(join(dataDir, "svge.json"), { encoding: "utf-8" })
  ) as { svgdata: { SVGElements: SvgElement[] } };

  // needed for Mineline 25290101
  missionIDs.add("25131")

  const filteredSvgElements = svgdContent.svgdata.SVGElements.filter((el) =>
    missionIDs.has(el.id)
  );

  await writeFile(
    join(exportDir, "svge.json"),
    JSON.stringify({ svgdata: { SVGElements: filteredSvgElements } }),
    { encoding: "utf-8" }
  );

  for (const version of ["msd", "mse"]) {

    const originalContent = JSON.parse(
      await readFile(join(dataDir, `${version}.json`), { encoding: "utf-8" })
    ) as MseData;
  
    let ss = "";
    let e = "";
    let et = "";
    let est = "";
  
    const symbols: MseSymbol[] = [];
  
    for (const JSONSymbol of originalContent[version as "mse"|"msd"].SYMBOL) {
      if (JSONSymbol.ss !== "") ss = JSONSymbol.ss;
      if (JSONSymbol.e !== null && JSONSymbol.e !== "") {
        e = JSONSymbol.e;
        et = "";
        est = "";
      }
      if (JSONSymbol.et !== null && JSONSymbol.et !== "") {
        et = JSONSymbol.et;
        est = "";
      }
      if (!!missions.find((mission) => {
        if (version === "msd") {
          return requiredForMsdToWork.has(JSONSymbol.code) || mission.code === JSONSymbol.code;
        } else {
          return mission.code === JSONSymbol.code
        }
      })) {
        symbols.push({
          ...JSONSymbol,
          ss,
          e,
          et,
          est,
        });
      }
    }
  
    const output = {
      [version]: {
        SYMBOL: symbols,
      },
    };
  
    await writeFile(join(exportDir, `${version}.json`), JSON.stringify(output), {
      encoding: "utf-8",
    });
  }

}

main();
