import fs from "fs"
import path from "path"
import yaml from "js-yaml"

const postsDir = "./posts"
const fields = ["slug","title","description","published_at","category","tags","status","cover_image","author","featured"]

const index = fs.readdirSync(postsDir)
  .map(folder => {
    const meta = yaml.load(fs.readFileSync(`${postsDir}/${folder}/meta.yml`, "utf8"))
    return Object.fromEntries(fields.map(f => [f, meta[f]]))  // only pick index-worthy fields
  })
  .filter(p => p.status === "published")
  .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))

fs.writeFileSync("./index.json", JSON.stringify(index, null, 2))
