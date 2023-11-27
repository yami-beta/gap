import { Command } from "https://deno.land/x/cliffy@v1.0.0-rc.3/command/mod.ts";
import { createHash } from "node:crypto";
import { echo, fs, globby, path } from "npm:zx@7.2.3";

async function assetPath(
  args: { srcDir: string; destDir: string; outputPath: string },
) {
  const assets = await collectAssets(args.srcDir, args.destDir);

  for (const asset of assets) {
    await fs.copy(asset.srcPath, asset.destPath);
  }

  await fs.outputJson(
    args.outputPath,
    Object.fromEntries(assets.map((a) => [a.src, a.dest])),
    {
      spaces: 2,
    },
  );

  echo(`Output: ${args.outputPath}`);
}

interface Asset {
  src: string;
  dest: string;
  srcPath: string;
  destPath: string;
}

async function collectAssets(srcDir: string, destDir: string) {
  const assets: Asset[] = [];

  const filepaths = await globby(srcDir);
  for (const filepath of filepaths) {
    const relativePath = path.relative(srcDir, filepath);

    const bytes = await fs.readFile(filepath);

    const sha256 = createHash("sha256");
    sha256.update(bytes);
    const hex = sha256.digest("hex");

    const ext = path.extname(relativePath);
    const name = `${path.basename(relativePath, ext)}.${hex}${ext}`;

    assets.push({
      src: relativePath,
      dest: path.join(path.dirname(relativePath), name),
      srcPath: filepath,
      destPath: path.join(destDir, path.dirname(relativePath), name),
    });
  }

  return assets;
}

if (import.meta.main) {
  const { options } = await new Command()
    .name("gap")
    .option("--src <src>", "Source directory", { required: true })
    .option("--dest <dest>", "Destination directory", { required: true })
    .option("--output <output>", "Output filename", {
      default: "assets.json",
    })
    .parse(Deno.args);

  const cwd = Deno.cwd();
  const srcDir = path.relative(cwd, options.src);
  const destDir = path.relative(cwd, options.dest);
  const outputPath = path.relative(cwd, options.output);

  await assetPath({ srcDir, destDir, outputPath });
}
