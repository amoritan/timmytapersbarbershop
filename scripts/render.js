const mustache = require('mustache');
const showdown = require('showdown');
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');

const {
  readFile,
  writeFile,
  readDirectory,
  prepareDirectory,
} = require('./utils/filesHandler');
const { IMAGE_RESOLUTIONS } = require('./utils/constants');

const showdownConverter = new showdown.Converter();

const render = async () => {
  let baseTemplate = await readFile('index.html');
  let baseWebsiteData = await readFile(`content/website.json`, true);

  const websiteData = {
    ...baseWebsiteData,
    body: showdownConverter.makeHtml(baseWebsiteData.markdown_body),
    footer: showdownConverter.makeHtml(baseWebsiteData.markdown_footer),
  };

  const websiteOutput = mustache.render(baseTemplate, websiteData);
  writeFile('build/index.html', websiteOutput);
};

render();
