FloorplanFilesystem.prototype.plusplus = function()
{
	/*	Get data from localstorage  */
	var items = window.localStorage.getItem(this.getCurrentFileName());
	var data = JSON.parse(items);
	data.nodeDataArray[0].cup++
	data.nodeDataArray[0].text = data.nodeDataArray[0].cup + '-0';
	
	/*	Change whole model here , will refresh the floorplan */
    floorplan.model = go.Model.fromJson(data); 
	floorplan.isModified = true;
	window.localStorage.setItem(this.getCurrentFileName(), this.floorplan.model.toJson());

	/*	Search all palettes, find the associated table here  */
    var floorplan = this.floorplan;
	console.log(this.getCurrentFileName());	
    var palettes = floorplan.palettes;
    for (var i = 0; i < palettes.length; i++) {
        console.log(palettes[i].model.nodeDataArray[i]);
    }

	/* Change the cup and text dynamically */
	var cup = ++this.floorplan.palettes[0].model.nodeDataArray[0].cup;
	var str = cup + "-0";
	this.floorplan.model.setDataProperty(this.floorplan.model.nodeDataArray[0], "cup", cup);
	this.floorplan.model.setDataProperty(this.floorplan.model.nodeDataArray[0], "text", str);
	console.log(this.floorplan.model.nodeDataArray[0].cup);
	console.log(this.floorplan.model.nodeDataArray[0].text);
	window.localStorage.setItem(this.getCurrentFileName(), this.floorplan.model.toJson());

	/* Update UI if necessary */
    if (floorplan.floorplanUI) {
        floorplan.floorplanUI.updateUI();
        floorplan.floorplanUI.updateStatistics();
    }
}
