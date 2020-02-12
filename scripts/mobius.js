
function toggleMeetingFiles() {
  jQuery( "#meeting-file-pane" ).on("click", "tr", function() {
    jQuery(this).find(".file-wrapper").has('a').slideToggle( "fast", function() {
    });
  });
  jQuery("#meeting-file-pane").on("click", "a", function(e) {
    e.stopPropagation();
  });
}

jQuery(document).ready( function () {
    
    // How many rows are in the table?
    // After 30 rows - we want to convert the table into a searchable table with pagination
    var searchableThreshold = 30;
    
    jQuery("table").each(function(){
        var thisRowCount = 0;

       jQuery(this).find( "tr").each(function(){
           thisRowCount++;
       });

       if(thisRowCount > searchableThreshold)
       {
           jQuery(this).DataTable( {
               paging: true,
               lengthMenu: [ 100, 25, 50, 1000 ]
           } );
       }
    });
    
} );


jQuery(document).ready( function () {
  
    var leftover = window.location.href;
    var mainpage = 1;

    // Make sure we are on the main page
    if( leftover = leftover.replace(/https?:\/\/[^\/]*?\/(.*)/,'$1') )
    {
        // Sorry this is so hardcoded
        if( leftover != 'front' )
        {
            mainpage = 0;
        }
    }
    
    // Make sure we are not logged into the CMS
    if(jQuery("#edit-shortcuts").html())
    {
        mainpage = 0;
    }

    if(mainpage)
    {
        
// Dealing with the flex tiles
        var finalFlex = '<div class="front-grid-flex-title">Our Services</div>\n'+
        '<div class="front-grid-flex-container">';
        console.log( 'landing page code execution for flex display' );
        jQuery(".view-front-page-link-grid > div > div.views-row").each(function(){
            
            var theseVals = {};
            
            jQuery(this).find( ".front-grid-heading > a").each(function(){
                theseVals.url = jQuery(this).attr('href');
                theseVals.heading = jQuery(this).html();
            });
            
            jQuery(this).find( ".front-page-subheading").each(function(){
                theseVals.subheading = jQuery(this).html();
            });
            
            jQuery(this).find( ".front-page-background-image > img").each(function(){
                theseVals.image = jQuery(this).attr('src');
            });
            
            finalFlex += '<div class = "front-grid-flex-item" style="background-image: url(\'' + theseVals.image + '\');" >\n';
            finalFlex += '<a class = "front-grid-flex-item-a" href="' + theseVals.url + '" >\n';
            finalFlex += '<div class = "front-grid-flex-heading" >' + theseVals.heading + '</div>\n';
            finalFlex += '<div class = "front-grid-flex-subheading" >' + theseVals.subheading + '</div>\n';
            
            finalFlex += '</a></div>';
            
            // console.log( 'got url = ' + theseVals.url );
            // console.log( 'got heading = ' + theseVals.heading );
            // console.log( 'got subheading = ' + theseVals.subheading );
            // console.log( 'got image = ' + theseVals.image );
            
        });

        finalFlex += '</div>';
        jQuery(".view .view-front-page-link-grid").css('display','block');
        jQuery("div.view-front-page-link-grid").html(finalFlex);
// Dealing with the flex tiles

// Dealing with the map side-by-side table

        var appdendMapTable = "<table id='mobius-map-table'><tr>";
        var elementsToAdd = [];
        var cellNum = 0;

        var blockSelectorArray = [".block-branch-map-west-block",".block-branch-map-east-block",".block-branch-map-non-us-block"];
        
        for (var i = 0; i < blockSelectorArray.length; i++)
        {
            if( jQuery(blockSelectorArray[i]).html() )
            {
                appdendMapTable += "<td id='mobius-map-table-"+cellNum+"'></td>";
                elementsToAdd.push(document.getElementById( jQuery(blockSelectorArray[i]).attr('id') ) );
                cellNum++;
            }
        }
        appdendMapTable += "</tr></table>";
        jQuery("#content").append(appdendMapTable);
        
        for (var i = 0; i < elementsToAdd.length; i++)
        {
            var newParent = document.getElementById('mobius-map-table-' + i );
            newParent.appendChild(elementsToAdd[i]);
        }

// Dealing with the map side-by-side table

// Dealing with testimonial table

        jQuery(".views-view-grid.cols-3 > tbody").prepend("<tr><th colspan='3'>TESTIMONIALS</th></tr>");
        
        jQuery(".front-page-testimonial .node-title a").each(function(){
            jQuery(this).attr('href','/testimonials');
        });
        


// Dealing with testimonial table
        
        
    }
} );

