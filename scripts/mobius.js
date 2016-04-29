function toggleMeetingFiles() {
  jQuery( ".meeting-view-table tr" ).click(function() {
    jQuery(this).find(".file-wrapper").has('a').slideToggle( "fast", function() {
      // Animation complete.
    });
  });
}
