import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const inputPath = process.argv[2] || path.join(rootDir, "data", "jp_city.c.topojson");
const outputPath = process.argv[3] || path.join(rootDir, "data", "hyogo-boundaries.topojson");

const hyogoCodes = new Set([
  "28101",
  "28102",
  "28105",
  "28106",
  "28107",
  "28108",
  "28109",
  "28110",
  "28111",
  "28201",
  "28202",
  "28203",
  "28204",
  "28205",
  "28206",
  "28207",
  "28208",
  "28209",
  "28210",
  "28212",
  "28213",
  "28214",
  "28215",
  "28216",
  "28217",
  "28218",
  "28219",
  "28220",
  "28221",
  "28222",
  "28223",
  "28224",
  "28225",
  "28226",
  "28227",
  "28228",
  "28229",
  "28301",
  "28365",
  "28381",
  "28382",
  "28442",
  "28443",
  "28446",
  "28464",
  "28481",
  "28501",
  "28585",
  "28586"
]);

const topology = JSON.parse(await fs.readFile(inputPath, "utf8"));
const objectName = Object.keys(topology.objects)[0];
const object = topology.objects[objectName];

if (!object || object.type !== "GeometryCollection") {
  throw new Error(`Unsupported TopoJSON object: ${objectName}`);
}

object.geometries = object.geometries.filter((geometry) => {
  const props = geometry.properties || {};
  const id = String(props.id || props.code || props.N03_007 || geometry.id || "");
  return [...hyogoCodes].some((code) => id.startsWith(code));
});

await fs.writeFile(outputPath, `${JSON.stringify(topology)}\n`);
console.log(`Wrote ${object.geometries.length} Hyogo geometries to ${outputPath}`);
