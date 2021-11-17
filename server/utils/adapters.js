const HUB_CONTENT_TYPES = {
  moj_radio_item: 'radio',
  moj_pdf_item: 'pdf',
  moj_video_item: 'video',
  landing_page: 'landing-page',
  page: 'page',
  series: 'series',
  tags: 'tags',
};

function typeFrom(type) {
  const matches = type.match(/(?<=--)(.*)/g);
  return HUB_CONTENT_TYPES[matches ? matches[0] : type];
}

module.exports = {
  typeFrom,
};
