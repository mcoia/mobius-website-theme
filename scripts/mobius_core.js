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

class MemberLibraryPage {

    memberLibraryJsonArray = [];

    constructor() {

        this.memberLibraryJsonArray = this.getJSON();
        // this.removeStandaloneLibraries();
        this.checkImageNotFound();
        this.render();

    }

    getJSON() {

        let json;

        jQuery.ajax({
            url: "/api/member-libraries",
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

    getTestJSON(){
        return [{"title":"A.T. Still University","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=001-800\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/atsu.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/atsu_0.png","field_member_type":"MOBIUS Managed"},{"title":"Altoona Public Library","field_ebsco_discovery_service":"","field_locate_catalog":"","field_logo":"","field_member_type":"Standalone"},{"title":"Avila University","field_ebsco_discovery_service":"\/node\/1011","field_locate_catalog":"http:\/\/avila.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/avila_0.jpeg","field_member_type":"MOBIUS Managed"},{"title":"Benedictine College","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=s6488792\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/benedictine.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/benedictine_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Bettendorf Public Library","field_ebsco_discovery_service":"","field_locate_catalog":"","field_logo":"","field_member_type":"Standalone"},{"title":"Calvary University","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=s8854636\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/calvary.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/calvary_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Central Arkansas Library System","field_ebsco_discovery_service":"","field_locate_catalog":"","field_logo":"","field_member_type":"Standalone"},{"title":"Central Methodist University","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=s8854636\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/centralmethodist.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/centralmethodist.png","field_member_type":"MOBIUS Managed"},{"title":"Christian County Library","field_ebsco_discovery_service":"","field_locate_catalog":"","field_logo":"","field_member_type":"Standalone"},{"title":"Columbia College","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=010-800\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/ccis.searchmobius.org\/","field_logo":"\/sites\/default\/files\/2024-05\/columbiacollege_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Conception Abbey and Seminary College","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=s5969680\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/conception.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/conception_abbey_logo.jpg","field_member_type":"MOBIUS Managed"},{"title":"Concordia Seminary","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=s8500801\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"https:\/\/concordia.searchmobius.org\/search","field_logo":"\/sites\/default\/files\/2024-05\/concordia_seminary_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Cottey College","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=s5912001\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/cottey.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/cottey_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Covenant Theological Seminary","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=s8518363\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/covenant.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/covenant-logo.png","field_member_type":"MOBIUS Managed"},{"title":"Crowder College","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=073-700\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/crowder.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/crowder_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Culver-Stockton College","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=056-800\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/culver.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/culverstockton-logo.png","field_member_type":"MOBIUS Managed"},{"title":"Davenport Public Library","field_ebsco_discovery_service":"","field_locate_catalog":"","field_logo":"","field_member_type":"Standalone"},{"title":"Drury University","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=039-800\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/drury.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/drury-logo.png","field_member_type":"MOBIUS Managed"},{"title":"East Central College","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=036-700\u0026amp;groupid=main\u0026amp;profid=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/eastcentral.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/eastcentral_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Evangel University","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=039-810\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/evangel.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/evangel_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Fontbonne University","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=102-900\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/fontbonne.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/fontbonne_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Goldfarb School of Nursing at Barnes-Jewish College","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=ns003336\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/goldfarb.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/goldfarb_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Hannibal-LaGrange University","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=039-700\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/hlgu.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/hlgu.png","field_member_type":"MOBIUS Managed"},{"title":"Harris-Stowe State University","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=harrstow\u0026amp;groupid=main\u0026amp;profid=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/hssu.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/harrisstowe_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Jefferson College","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=050-700\u0026amp;groupid=main\u0026amp;profid=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/jclibrary.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/jefferson_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Kansas City Art Institute ","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=s4626554\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/kcai.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/kansascityart_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Kansas City Kansas Community College","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=s4559173\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/kckcc.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/kckcc_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Kansas City University","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=078-810\u0026amp;groupid=main\u0026amp;profid=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/kansascity.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/kansascity.png","field_member_type":"MOBIUS Managed"},{"title":"Kenrick-Glennon Seminary","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=s9605106\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/kenrick.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/kenrick_glennon_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Lincoln University","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=026-800\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/lincoln.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/lincoln_university_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Lindenwood University","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=092-800\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/lindenwood.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/lindenwood_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Logan University","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=logchir\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/logan.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/logan_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Maryville University","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=096-810\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/maryville.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/maryville_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Metropolitan Community College","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=078-700e\u0026amp;groupid=main\u0026amp;profid=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/mcckc.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/metropolitan_cc_logo.jpg","field_member_type":"MOBIUS Managed"},{"title":"Midwestern Baptist Theological Seminary","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=s8385080\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/mbts.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/midwestern_baptist_theoloical_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Mineral Area College","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=s3883240\u0026amp;groupid=main\u0026amp;profid=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/mineralarea.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/mineral_area_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Missouri Baptist University","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=s8856270\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/mobap.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/missouri_baptist_university_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Missouri Botanical Garden","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=ns009098\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/mbg.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/missouri_botanical_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Missouri History Museum","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=s4169105\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/mohistory.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/mohistory.png","field_member_type":"MOBIUS Managed"},{"title":"Missouri River Regional Library","field_ebsco_discovery_service":"","field_locate_catalog":"","field_logo":"","field_member_type":"Standalone"},{"title":"Missouri Southern State University","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=049-800\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/mssu.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/missouri_southern_state_university_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Missouri State Library","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=026-920\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/mosl.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/mosl_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Missouri University of Science and Technology","field_ebsco_discovery_service":"","field_locate_catalog":"","field_logo":"","field_member_type":"Standalone"},{"title":"Missouri Valley College","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=s8486983\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/moval.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/missouri_valley_college_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Missouri Western State University","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=011-800\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/mwsu.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/missouri_western_state_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Moberly Area Community College","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=088-700\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/macc.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/moberly_area_community_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Nazarene Theological Seminary","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=s3586265\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/nazarene.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/nazarene_theological_seminary_logo.png","field_member_type":"MOBIUS Managed"},{"title":"North Central Missouri College","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=040-700\u0026amp;groupid=main\u0026amp;profid=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/ncmissouri.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/ncmissouri_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Northwest Missouri State University","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=074-800\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/nwmissouri.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/northwest_missouri_state_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Ozark Christian College","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=s6474988\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/occ.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/OCC_Locate_Logo.png","field_member_type":"MOBIUS Managed"},{"title":"Ozarks Technical Community College","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=039-710\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"https:\/\/otc.searchmobius.org\/search","field_logo":"\/sites\/default\/files\/2024-05\/otc.png","field_member_type":"MOBIUS Managed"},{"title":"Park University","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=083-900\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/park.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/park_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Rockhurst University ","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=s8855207\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/rockhurst.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/rockhurst_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Saint Louis Art Museum","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=ns130707\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/slam.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/slam.png","field_member_type":"MOBIUS Managed"},{"title":"Saint Louis University","field_ebsco_discovery_service":"","field_locate_catalog":"","field_logo":"","field_member_type":"Standalone"},{"title":"Saint Paul School of Theology","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=s8520310\u0026amp;groupid=main\u0026amp;profid=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/spst.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/saintpaul_theology_logo.jpg","field_member_type":"MOBIUS Managed"},{"title":"Southeast Missouri State University","field_ebsco_discovery_service":"","field_locate_catalog":"","field_logo":"","field_member_type":"Standalone"},{"title":"Southwest Baptist University","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=084-800\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/sbuniv.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/southwest_baptist_university_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Southwestern Baptist Theological Seminary","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=s3270309\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/swbts.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/swbts.png","field_member_type":"MOBIUS Managed"},{"title":"Springfield-Greene County Library","field_ebsco_discovery_service":"","field_locate_catalog":"","field_logo":"","field_member_type":"Standalone"},{"title":"St. Charles City-County Library","field_ebsco_discovery_service":"","field_locate_catalog":"","field_logo":"","field_member_type":"Standalone"},{"title":"St. Charles Community College","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=092-700\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/stchas.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/stchas_logo.png","field_member_type":"MOBIUS Managed"},{"title":"St. Louis Community College","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=092-700\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/stlcc.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/stlcc.png","field_member_type":"MOBIUS Managed"},{"title":"St. Louis County Library","field_ebsco_discovery_service":"","field_locate_catalog":"","field_logo":"","field_member_type":"Standalone"},{"title":"State Fair Community College","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=s4879986\u0026amp;groupid=main\u0026amp;profid=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/sfccmo.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/sfccmo_logo.png","field_member_type":"MOBIUS Managed"},{"title":"State Technical College of Missouri","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=076-700\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/statetechmo.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/statetechcollege_mo_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Stephens College","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=010-820\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/stephens.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/stephens_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Three Rivers College","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=012-700\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/trcc.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/three_rivers_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Truman State University","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=001-810\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/truman.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/truman_logo.png","field_member_type":"MOBIUS Managed"},{"title":"Tulsa City-County Library","field_ebsco_discovery_service":"","field_locate_catalog":"","field_logo":"","field_member_type":"Standalone"},{"title":"University of Health Sciences and Pharmacy in St. Louis","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=s8432196\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/uhsp.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/uhsp_logo.jpeg","field_member_type":"MOBIUS Managed"},{"title":"University of Missouri - Columbia","field_ebsco_discovery_service":"","field_locate_catalog":"","field_logo":"","field_member_type":"Standalone"},{"title":"University of Missouri - Kansas City","field_ebsco_discovery_service":"","field_locate_catalog":"","field_logo":"","field_member_type":"Standalone"},{"title":"University of Missouri - St. Louis","field_ebsco_discovery_service":"","field_locate_catalog":"","field_logo":"","field_member_type":"Standalone"},{"title":"Washington University","field_ebsco_discovery_service":"","field_locate_catalog":"","field_logo":"","field_member_type":"Standalone"},{"title":"Webster University - Eden Theological Seminary","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=s8997292\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/webster.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/webster_logo.png","field_member_type":"MOBIUS Managed"},{"title":"West Des Moines Public Library","field_ebsco_discovery_service":"","field_locate_catalog":"","field_logo":"","field_member_type":"Standalone"},{"title":"Westminster College","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=014-800\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/westminster.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/wcmo-logo.png","field_member_type":"MOBIUS Managed"},{"title":"William Jewell College","field_ebsco_discovery_service":"https:\/\/search.ebscohost.com\/login.aspx?custid=024-800\u0026amp;groupid=main\u0026amp;profile=eds-folio\u0026amp;authtype=ip%2Cguest%2Cuid","field_locate_catalog":"http:\/\/jewell.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/jewell.png","field_member_type":"MOBIUS Managed"},{"title":"William Woods University","field_ebsco_discovery_service":"http:\/\/williamwoods.searchmobius.org","field_locate_catalog":"http:\/\/williamwoods.searchmobius.org","field_logo":"\/sites\/default\/files\/2024-05\/williamwoods.png","field_member_type":"MOBIUS Managed"}];
    }

    removeStandaloneLibraries() {
        this.memberLibraryJsonArray = this.memberLibraryJsonArray.filter(item => item.field_member_type !== 'Standalone');
    }

    checkImageNotFound() {

        let imageNotFoundURL = '/sites/default/files/site/image-not-found.jpg';

        // loop through json array and check if field_logo is empty, if it is assign the url to imageNotFoundURL
        for (let i = 0; i < this.memberLibraryJsonArray.length; i++) {

            if (this.memberLibraryJsonArray[i].field_logo == "") {
                this.memberLibraryJsonArray[i].field_logo = imageNotFoundURL;
            }

        }

    }

    render() {

        let libraries = this.memberLibraryJsonArray;

        // library card generation

        let html = '';
        for (let i = 0; i < libraries.length; i++) {
            html +=
                `
                   <div class="col-12 col-md-6 col-lg-4 col-xl-3">
                        <div class="card mb-4 shadow-sm">
                            <img class="${libraries[i].class} card-img-top" src="${libraries[i].field_logo}" alt="${libraries[i].title} logo">
                            <div class="card-body">
                                <p class="card-text">${libraries[i].title}</p>
                                <div class="d-flex justify-content-center align-items-center">
                                    <div class="btn-group">
                                        <a href="${libraries[i].field_ebsco_discovery_service}" target="_blank" class="btn btn-sm btn-outline-secondary">EBSCO Discovery</a>
                                        <a href="${libraries[i].field_locate_catalog}" target="_blank" class="btn btn-sm btn-outline-secondary">Locate Catalog</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> 
                `
            ;
        }

        jQuery("#member-libraries").html(html);

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

    if (window.location.pathname == '/member-libraries' || '/firefox/member-libraries.html') {
        new MemberLibraryPage();
    }

    // Scan for data tables and init if needed
    new DataTablesCheck().scan();

});
