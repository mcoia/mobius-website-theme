class LandingPage {

  constructor() {

    this.hidePageTitle();
    this.setLandingPageTitle();
    this.printWelcomeMessage();
    this.positionGridBlocks();
    this.addMobiusTitleToMainMap();
    this.positionGoogleMaps();
    this.removePageCouldNotBeFound();

  }

  hidePageTitle() {
    jQuery('h1.view-title').hide();
  }

  setLandingPageTitle() {
    jQuery(document).prop('title', 'MOBIUS Consortium - Linking Libraries | Value and diversity through resource sharing and collaborative collection development.');
  }

  printWelcomeMessage() {
    console.clear();
    console.log(`Welcome to mobiusconsortium.org -- ${new Date().toLocaleTimeString()}`);
  }

  positionGridBlocks() {

    let blockHTML = '';
    jQuery('#front-page-grid-blocks .grid-block-item').each(function () {

      let heading = jQuery(this).find('.views-field-field-front-page-heading').text();
      let subheading = jQuery(this).find('.views-field-field-front-page-subheading').text();
      let img = jQuery(this).find('img').attr('src');
      let link = jQuery(this).find('a').attr('href');

      blockHTML += '<div class = "front-grid-flex-item" style="background-image: url(' + img + ');" >\n';
      blockHTML += '<a class = "front-grid-flex-item-a" href=\'' + link + '\' >\n';
      blockHTML += '<div class = "front-grid-flex-heading" >' + heading + '</div>\n';
      blockHTML += '<div class = "front-grid-flex-subheading" >' + subheading + '</div>\n';

      blockHTML += '</a></div>';
      blockHTML += '</div>';

    });

    jQuery('#front-page-grid-blocks').css('display', 'flex');
    jQuery('#front-page-grid-blocks').html(blockHTML);

  }

  addMobiusTitleToMainMap() {
    jQuery('#block-views-block-branch-map-central-block-1').before('<h2 class="block-title map-title">MOBIUS MEMBER LOCATIONS</h2>');
  }

  positionGoogleMaps() {
    // wrap the maps in a div called 'map-container' which is a flexbox
    // container
    jQuery('#block-views-block-branch-map-west-block-1,#block-views-block-branch-map-non-us-block-1').wrapAll('<div class="map-container">');
  }

  removePageCouldNotBeFound() {
    // jQuery('#block-mainpagecontent').replaceAll('The requested page could
    // not be found.', '');
    jQuery('#block-mainpagecontent').text(function () {
      return jQuery(this).text().replace('The requested page could not be found.', '');
    });
  }

}

// ~/branch-list
class BranchListPage {

  setTableStriped() {
    jQuery('table').addClass('table-striped');
  }

}

// ~/digitization
class DigitizationPageSliders {


  /*
   slider library used: https://github.com/kenwheeler/slick

   css classes:
   #digitization-container - wrapper for everything
   .library-sliders - wrapper for all our sliders

   // library classes
   #library-x - individual library id. x = number
   .library-container - all libraries
   .library-title - title

  */

  containerID = '#digitization-container';

  constructor() {
    this.build();
  }

  build() {

    let json = this.getJSON();
    let html = this.buildHTML(json);

    this.injectHTML(html);
    this.initSliders(json.length);

  }

  getJSON() {

    let json;

    jQuery.ajax({
      url: "/api/digitization",
      method: "GET",
      async: false,
      headers: {
        "Content-Type": "application/json"
      },
      success: function (data, status, xhr) {
        json = data;
      }
    })

    return json;
  }

  buildHTML(json) {

    let html = '<div id="library-sliders">';

    for (let i = 0; i < json.length; i++) {

      html += `<div id='library-${i}' class="library-container">

                  <h2 class="library-title">
                    <a class="underline" href="${json[i].field_library_vital_link}" target="_blank">${json[i].title}</a>
                  </h2>

                  <div id="library-${i}-slider">
                    ${this.buildSliderImages(json[i])}
                  </div>

              </div>`;

    }

    html += '</div>';

    return html;
  }

  buildSliderImages(json) {

    // convert our json comma spaced string into an array for relative paths
    let imagesRelativePaths = json.field_digitization_library_image.split(',');

    let html = '';

    for (const img of imagesRelativePaths) {
      html += `<img class='library-slider-img' src='${img}' alt=""/>`
    }

    return html;
  }

  injectHTML(html) {
    jQuery(this.containerID).append(html);
  }

  initSliders(length) {
    // https://github.com/kenwheeler/slick

    // autoplay in ms
    let autoPlayMax = 3000;
    let autoPlayMin = 1000;

    for (let i = 0; i < length; i++) {

      jQuery(`#library-${i}-slider`).slick({
        autoplay: true,
        autoplaySpeed: Math.floor(Math.random() * (autoPlayMax - autoPlayMin + 1) + autoPlayMin),
        dots: true,
        arrows: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        draggable: false,
        infinite: true,
        variableWidth: true,
        centerMode: true,
        lazyLoad: 'progressive'
      });

    }

  }

}

// Scan page for tables exceeding n count rows & convert to data table
class DataTablesCheck {

  scan(force) {

    // force the use of datatables
    if (force == undefined) {
      force = false;
    }

    // max number of rows before we convert to datatable
    let maxRows = 30;

    // // Just in case we have more than 1 table on the page we'll just each()
    jQuery('table').each(function () {

      // This is the total number of <tr> tags in our table
      let totalRowCount = jQuery(this).find('tbody>tr').length;

      // set to data table
      if (totalRowCount > maxRows || force) {

        console.log('Converting to datatable...');

        // create datatable
        jQuery(this).dataTable({
          paging: true,
          lengthMenu: [25, 50, 100, 250, 500, 1000]
        });

      }

    });

  }

}

jQuery(document).ready(() => {

  // Landing Page
  if (window.location.pathname == '/') {
    new LandingPage();
  }

  if (window.location.pathname == '/branch-list') {
    new BranchListPage().setTableStriped();
  }

  if (window.location.pathname == '/digitization' || window.location.pathname == '/node/1769') {
    new DigitizationPageSliders();
  }

  if (window.location.pathname == '/google-analytics-reports' || window.location.pathname == '/node/281') {
    // new DataTablesCheck().scan(true);
  }

  // Scan for data tables and init if needed
  new DataTablesCheck().scan();

});
