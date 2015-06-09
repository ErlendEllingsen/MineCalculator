var resourcetotalResourcesDB = {};

var totalResources = {};
var totalResourcesMinReq = {};

var availableMods = [
	'Vanilla', 'Thermal Expansion'
];

	
$(document).ready(function(){	

	$.get( "recipes.json", function( data ) {

		resourceDB = data;	

		//Try
		calculate('bowl', 1);
		postCalculate();
		
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
		if (resourceDB[modName]['recipes'][resource] != undefined) foundModName = modName;
	});

	//Mod does not exist.. 
	if (foundModName === false) return;
	
	//Check if resource is in minimumRequirements, if so -> store for post-processing.
	if (resourceDB[foundModName]['minimumRequirements'][resource] != undefined) totalResourcesMinReq[resource] = foundModName;

	//Mod found and resource therefore exists.
	var subResources = resourceDB[foundModName]['recipes'][resource];

	//Check subresoruces, check if they can further expand.
	$.each(subResources, function(subResourceName, subResourceAmount){

		//Check the mod-thing with the sub-resources.
		var foundModName = false;
		$.each(availableMods, function(modIndex, modName){
			if (resourceDB[modName]['recipes'][subResourceName] != undefined) foundModName = modName;
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

		//Adjust materialamount! materialAmount needs to be multiplied with amount (caller-resource-amt).
		materialAmount *= amount;

		calculate(materialName, materialAmount);
		console.log('Calculating ' + materialName + ' x ' + materialAmount);
	});


	//Add the gathered materials to the total.
	$.each(exportObject, function(materialResource, materialAmount) {

		if (totalResources[materialResource] == undefined) {
			totalResources[materialResource] = materialAmount * amount;
		} else {
			totalResources[materialResource] += materialAmount * amount;
		}

		//end of materialloop.
	});


	//end of calculate.
}

function postCalculate() {
	

	$.each(totalResourcesMinReq, function(resourceName, resourceMod){

		//Find the multiplication-rule.
		var minReqMR = resourceDB[resourceMod]['minimumRequirements'][resourceName];
		var currentAmnt = totalResources[resourceName];

		console.log('Current sum of ' + resourceName + ' is ' + currentAmnt + ', needs to be product of ' + minReqMR);


	});


}