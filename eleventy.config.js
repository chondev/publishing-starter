import { EleventyHtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  const pathPrefix = process.env.SITE_PATH_PREFIX || "/";
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin, { baseHref: pathPrefix });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addWatchTarget("src/assets/");
  eleventyConfig.setServerOptions({
    port: 8097,
    liveReload: true,
    domDiff: false
  });

  return {
    pathPrefix,
    dir: { input: "src", includes: "_includes", data: "_data", output: "dist" },
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk"
  };
}
