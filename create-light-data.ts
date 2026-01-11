import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const missions = [
  // { code: "25270501 25340100", label: "Block" },
  // { code: "25270503 25341100", label: "Fix" },
  { prefix: "25", code: "141700", label: "Ambush" },
  { prefix: "25", code: "151204", label: "Contain" },
  { prefix: "25", code: "151205", label: "Retain" },
  { prefix: "25", code: "151403", label: "Axis of Advance" },
  { prefix: "25", code: "152000", label: "Attack by fire position" },
  { prefix: "25", code: "152600", label: "Area Defense" },
  { prefix: "25", code: "152800", label: "Mobile Defense" },
  { prefix: "25", code: "270501", label: "Block" },
  { prefix: "25", code: "270502", label: "Disrupt" },
  { prefix: "25", code: "270503", label: "Fix" },
  { prefix: "25", code: "270602", label: "Difficult" },
  { prefix: "25", code: "340200", label: "Breach" },
  { prefix: "25", code: "340300", label: "Bypass" },
  { prefix: "25", code: "340400", label: "Canalize" },
  { prefix: "25", code: "340500", label: "Clear" },
  { prefix: "25", code: "340600", label: "Counter Attack" },
  { prefix: "25", code: "340700", label: "CATK By Fire" },
  { prefix: "25", code: "340800", label: "Delay" },
  { prefix: "25", code: "340900", label: "Destroy" }, //
  { prefix: "25", code: "341400", label: "Interdict" }, //
  { prefix: "25", code: "341500", label: "Isolate" },
  { prefix: "25", code: "341600", label: "Neutralize" }, //
  { prefix: "25", code: "341700", label: "Occupy" },
  { prefix: "25", code: "342100", label: "Secure" },
  { prefix: "25", code: "342201", label: "Cover" },
  { prefix: "25", code: "342202", label: "Guard" },
  { prefix: "25", code: "342203", label: "Screen" },
  { prefix: "25", code: "342300", label: "Seize" },
  { prefix: "25", code: "342900", label: "Advance to contact" },
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

async function main() {

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
          return requiredForMsdToWork.has(JSONSymbol.code);
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
