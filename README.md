# gap (short for Generate Asset Path)

Copy and rename files into output directory.

## Install

```bash
deno install --allow-read --allow-write --allow-sys https://raw.githubusercontent.com/yami-beta/gap/main/gap.ts
```

## How to use

```bash
$ gap --src src --dest public
Output: assets.json
$ cat assets.json
{
  "foo.txt": "foo.b5bb9d8014a0f9b1d61e21e796d78dccdf1352f23cd32812f4850b878ae4944c.txt",
  "bar/baz.txt": "bar/baz.bf07a7fbb825fc0aae7bf4a1177b2b31fcf8a3feeaf7092761e18c859ee52a9c.txt"
}
$ tree
.
├── assets.json
├── public
│   ├── bar
│   │   └── baz.bf07a7fbb825fc0aae7bf4a1177b2b31fcf8a3feeaf7092761e18c859ee52a9c.txt
│   └── foo.b5bb9d8014a0f9b1d61e21e796d78dccdf1352f23cd32812f4850b878ae4944c.txt
└── src
    ├── bar
    │   └── baz.txt
    └── foo.txt

5 directories, 5 files
```

### Examples of using assets.json

```typescript
// assetPath.ts
import assets from "assets.json";

export function assetPath(path: keyof typeof assets) {
  return `/${assets[path]}`;
}

// Component.ts
import { assetPath } from "./assetPath.ts";

function Component() {
  return (
    <div>
      <img src={assetPath("foo.png")} />
    </div>
  );
}
```

## CLI usage

```bash
$ gap --help

Usage: gap --src <src> --dest <dest>

Options:

  -h, --help            - Show this help.
  --src       <src>     - Source directory       (required)
  --dest      <dest>    - Destination directory  (required)
  --output    <output>  - Output filename        (Default: "assets.json")
```
