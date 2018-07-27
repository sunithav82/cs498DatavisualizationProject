
d3.csv("data/wine-designation-points.csv", function(error, myData) {
    if (error) {
        console.log("Error");
    }

    //populate dropdown options with input data
	var dropdownOptions = [];
	myData.forEach(function(d, i){
		if ( dropdownOptions.indexOf(d.designation) == -1) {
			dropdownOptions.push(d.designation);
		}; 
	}); 
	var option = '';
	for (var i=0;i<dropdownOptions.length;i++){
	   option += '<option value="'+ dropdownOptions[i] + '">' + dropdownOptions[i] + '</option>';
	}; 
	$('#pickawine-select-2 option').empty(); //clear old options
	$('#pickawine-select-2').append(option); //add new options


    //listen to dropdown
	d3.select('#pickawine-select-2').on("change", function() {

		var dropdown = document.getElementById("pickawine-select-2");
		var designation_sel = dropdown.options[dropdown.selectedIndex].value;

	    var myArray = [];
	    myData.forEach(function(d, i){
	    	d.points = +d.points;
	    	//d.price = +d.price;
	        // Add a new array with the values of each:
	        if (d['designation'] == designation_sel) {
	        	myArray.push([d.title, d.designation, d.winery, d.province, d.country, d.taster_name, d.points]);
	    	};
	    });
	    //generate table
	    tabulate(myArray, ["title","designation","winery","province","country","taster_name",'points'],'#pickawine-result-2')

	});


});


//http://bl.ocks.org/yan2014/c9dd6919658991d33b87
//http://bl.ocks.org/jhubley/17aa30fd98eb0cc7072f
