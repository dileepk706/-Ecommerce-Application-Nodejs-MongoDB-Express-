$(document).ready(function() {
    
    "use strict";
    // editor
    if ($("#editor").length !== 0) {
     var quill = new Quill('#editor', {
	    theme: 'snow'
	  });
 	}

 	// touchspin
	 $("input[name='demo3']").each(function() {
	    $("input[name='demo3']").TouchSpin();
	})

	 // datepicker
	 if ($(".date-picker").length !== 0) {
	 $('.date-picker').datepicker({
        orientation: "top auto",
        autoclose: true
    });
	}
   
});