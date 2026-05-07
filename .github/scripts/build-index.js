import fs from "fs"
import yaml from "js-yaml"

const GITHUB_REPO = process.env.GITHUB_REPO || "MAYANK-T0MAR/blog"

const postsDir = "./posts"
const fields = ["title", "description", "published_at", "category", "tags", "status", "author", "featured"]

function calcReadTime(mdx, wpm = 225) {
    const clean = mdx
        .replace(/^---\n[\s\S]*?\n---/, '')
        .replace(/<[^>]*>/g, '')
        .replace(/```[\s\S]*?```/g, '')
        .replace(/[#*`_\[\]]/g, '')
        .trim()
    const words = clean.split(/\s+/).filter(w => w.length > 0)
    return Math.ceil(words.length / wpm)
}

const index = fs.readdirSync(postsDir)
    .map(folder => {
        const meta = yaml.load(fs.readFileSync(`${postsDir}/${folder}/meta.yml`, "utf8"))

        const mdxPath = `${postsDir}/${folder}/content.mdx`
        const mdx = fs.existsSync(mdxPath) ? fs.readFileSync(mdxPath, "utf8") : ""

        const assetsDir = `${postsDir}/${folder}/assets`
        const coverFile = fs.existsSync(assetsDir)
            ? fs.readdirSync(assetsDir).find(f => f.startsWith("cover."))
            : null

        return {
            ...Object.fromEntries(fields.map(f => [f, meta[f]])),
            slug: folder,
            cover_image: coverFile ? `https://cdn.jsdelivr.net/gh/${GITHUB_REPO}@main/posts/${folder}/assets/${coverFile}` : null,
            read_time: calcReadTime(mdx)
        }
    })
    .filter(p => p.status === "published")
    .sort((a, b) => new Date(b.published_at) - new Date(a.published_at))

fs.writeFileSync("./index.json", JSON.stringify(index, null, 2))
