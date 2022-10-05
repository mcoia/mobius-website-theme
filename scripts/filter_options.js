function isPermitted(from_array_id) {
  // create an array of intersort values that this library is allowed to send to
  console.log(from_array_id - 1);
  var permittedToVals = jQuery("#from_id option[value=" + (from_array_id) + "]")[0].attributes['data-permitted-to'].value.split(',')
  console.log(jQuery("#from_id option[value=" + (from_array_id) + "]")[0]);
  console.log(permittedToVals);

  // Loop through option elements and check that the intersort of each
  // exists in the array of permittedToVals we just created
  // If it doesn't exist, then disable the option.

  var to_options = jQuery("#to_id option")
  for (x = 0; x < to_options.length; x++) {
    var myIntersort = to_options[x].attributes['data-intersort'].value;
    if (jQuery.inArray(myIntersort, permittedToVals) == -1) {
      to_options[x].disabled = true;
    }
    else {
      to_options[x].disabled = false;
    }
  }
  // update the fancy Chosen list to match the source list, which we've just
  // modified.
  jQuery("#to_id").trigger("chosen:updated");
}

jQuery(document).ready(function () {
  jQuery(".chosen-select").chosen({search_contains: true});
  jQuery('#from_id').on('change', function (evt, params) {
    isPermitted(params['selected']);
  });
  var sel = jQuery('#from_id').chosen().val();
  if (sel.length > 0) {
    // Force the change trigger code to filter the "TO" list on page load
    isPermitted(sel);
  }
  else {
    // Suppress the "TO" dropdown when nothing is pre selected (from cookie or
    // otherwise)
    jQuery('#to_id_chosen').hide();
    jQuery('#from_id').on('change', function (evt, params) {
      jQuery('#to_id_chosen').show();
    });
  }
});
