import glob from "fast-glob";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import prettier from "prettier";
import sortPackageJson from "sort-package-json";

const cwd = resolve("node_modules/react-dom");
const paths = glob.sync(
  ["**/*", "!package.json", "!README.md", "!node_modules"],
  { cwd }
);
for (const path of paths) {
  mkdirSync(dirname(path), { recursive: true });
  copyFileSync(resolve(cwd, path), path);
}
const { browser, dependencies, peerDependencies, main } = JSON.parse(
  readFileSync("node_modules/react-dom/package.json", "utf8")
);
writeFileSync(
  "package.json",
  prettier.format(
    JSON.stringify(
      sortPackageJson({
        ...JSON.parse(readFileSync("package.json", "utf8")),
        browser,
        dependencies,
        peerDependencies,
        main,
      })
    ),
    { ...prettier.resolveConfig.sync("package.json"), filepath: "package.json" }
  )
);

// for (const path of [
//   "cjs/react-dom-server-legacy.node.development.js",
//   "cjs/react-dom-server-legacy.node.production.min.js",
//   "cjs/react-dom-server.node.development.js",
//   "cjs/react-dom-server.node.production.min.js",
// ]) {
//   writeFileSync(
//     path,
//     readFileSync(path, "utf8")
//       .replace(
//         '["contentEditable","draggable","spellCheck","value"]',
//         (m) => `["charSet",${m.slice(1)}`
//       )
//       .replace(
//         "['contentEditable', 'draggable', 'spellCheck', 'value']",
//         (m) => `['charSet', ${m.slice(1)}`
//       )
//   );
// }
