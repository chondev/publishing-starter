export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addWatchTarget("src/assets/");
  eleventyConfig.setServerOptions({
    port: 8097,
    liveReload: true,
    domDiff: false
  });

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "dist" },
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk"
  };
}
