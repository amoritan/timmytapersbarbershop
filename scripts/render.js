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
    about: showdownConverter.makeHtml(baseWebsiteData.markdown_about),
    footer: showdownConverter.makeHtml(baseWebsiteData.markdown_footer),
    email_url: `mailto:${baseWebsiteData.email_address.replace('(at)', '@')}`,
    phone_url: `tel:${baseWebsiteData.phone_number.replace(/[^0-9+]/g, '')}`,
  };

  const websiteOutput = mustache.render(baseTemplate, websiteData);
  writeFile('build/index.html', websiteOutput);
};

render();
