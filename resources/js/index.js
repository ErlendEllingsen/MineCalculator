var resourcetotalResourcesDB = {};
var totalResources = {};
var availableMods = [
	'Vanilla', 'Thermal Expansion'
];

	
$(document).ready(function(){	

	$.get( "recipes.json", function( data ) {
		resourceDB = JSON.parse(data);	
		


		//Try
		var topObject = resourceDB['Thermal Expansion']['steam dynamo'];
		calculate('steam dynamo', 1);
		
		$.each(totalResources, function(materialName, materialAmount) {
			$('#totalResources').append('<li>' + materialName + ' x ' + materialAmount + '</li>');
		});

		//end getr recipes
	});

});


function calculate(resource, amount) {
	
	var exportObject = {};
	var remainingObject = {};

	//Check that the resource and get the innermost.
	var foundModName = false;
	$.each(availableMods, function(modIndex, modName){
		if (resourceDB[modName][resource] != undefined) foundModName = modName;
	});

	//Mod does not exist.. 
	if (foundModName === false) return;
	// console.log('found mod name (' + foundModName + ') for ' + resource + ' x ' + amount);

	//Mod found and resource therefore exists.
	var subResources = resourceDB[foundModName][resource];

	//Check subresoruces, check if they can further expand.
	$.each(subResources, function(subResourceName, subResourceAmount){

		//Check the mod-thing with the sub-resources.
		var foundModName = false;
		$.each(availableMods, function(modIndex, modName){
			if (resourceDB[modName][subResourceName] != undefined) foundModName = modName;
		});

		if (foundModName) { //Can further expand
			remainingObject[subResourceName] = subResourceAmount;
		} else {
			//The resource cannot further expand, add to exportObject.
			exportObject[subResourceName] = subResourceAmount;

		}

	});

	//END PARSING OF CURRENT.
	//ADD SUBMATERIALS
	$.each(remainingObject, function(materialName, materialAmount) {
		calculate(materialName, materialAmount);
		console.log('Calculating ' + materialName + ' x ' + materialAmount);
	});


	//Add the gathered materials to the total.
	$.each(exportObject, function(materialResource, materialAmount) {
		console.log('Adding resource ' + materialResource + ' x ' + materialAmount + ' for ' + resource);

		if (totalResources[materialResource] == undefined) {
			totalResources[materialResource] = materialAmount * amount;
		} else {
			totalResources[materialResource] += materialAmount * amount;
		}

		//end of materialloop.
	});


	//end of calculate.
}



/**
 * $.each(rawMaterials, function(materialResource, materialAmount) {

				if (totalResources[materialResource] == undefined) {
					totalResources[materialResource] = materialAmount * amount;
				} else {
					totalResources[materialResource] += materialAmount * amount;
				}

				//end of materialloop.
			});
 */