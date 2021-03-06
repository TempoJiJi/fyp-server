/*
* Copyright (C) 1998-2017 by Northwoods Software Corporation
* All Rights Reserved.
*
* Floorplan Filesystem Class
* Handles Floorplan-specific saving / loading model data events
* Attached to a specific instance of Floorplan (via constructor); can be assigned to Floorplan.floorplanFilesystem
* Currently only supports saving / loading from localstorage
*/

/*
* Floorplan Filesystem Constructor
* @param {Floorplan} floorplan A reference to a valid instance of Floorplan
* @param {Object} state A JSON object with string ids for UI objects (windows, listboxes, HTML elements)
*   {
*       openWindowId: {String} the id of the HTML window to open a file
*       removeWindowId: {String} the id of the HTML window to remove files
*       currentFileId: {String} the id of the HTML element containing the name of the currently open file
*       filesToOpenListId: {String} the id of the HTML listbox in the openWindow
*       filesToRemoveListId: {String} the id of the HTML listbox of the removeWindow
*   }
*/

function FloorplanFilesystem(floorplan, state) {
    this._floorplan = floorplan;
    this._floorplan.floorplanFilesystem = this;
    this._UNSAVED_FILENAME = "(Unsaved File)";
    this._DEFAULT_MODELDATA = {
        "units": "centimeters",
        "unitsAbbreviation": "cm",
        "gridSize": 10,
        "wallWidth": 5,
        "preferences":
        {
            showWallGuidelines:true,
            showWallLengths:true,
            showWallAngles:true,
            showOnlySmallWallAngles:true,
            showGrid:true,
            gridSnap:true
        }
    };
    this._state = state;
}

FloorplanFilesystem.prototype.update = function(i, cup, info, notes, text)
{
    this.floorplan.model.setDataProperty(this.floorplan.model.nodeDataArray[i], "cup", cup);
    this.floorplan.model.setDataProperty(this.floorplan.model.nodeDataArray[i], "notes", notes);
    this.floorplan.model.setDataProperty(this.floorplan.model.nodeDataArray[i], "text", text);
    this.floorplan.model.setDataProperty(this.floorplan.model.nodeDataArray[i], "info", info);
}

FloorplanFilesystem.prototype.remove = function(cup_id, current)
{
    var items = window.localStorage.getItem(this.getCurrentFileName());
    var data = JSON.parse(items);
    for (var i = 0; i < data.nodeDataArray.length; i++) {
        if (i == current) continue;
        var notes = data.nodeDataArray[i].notes.toString().split("\n");
        for (var j = 1; j < notes.length; j++) {
            var cupID = notes[j].split(" ");
            if (cupID[0] == cup_id) {
                // Remove the cup_id from the notes
                notes.splice(j, 1);
                var cup = data.nodeDataArray[i].cup - 1;
                var info = data.nodeDataArray[i].info;
                if (cupID.length == 2)
                    info = info - 1;
                var text = cup + "-" + info;
                this.update(i, cup, info, notes, text);
                return;
            }
        }
    }
}

FloorplanFilesystem.prototype.service = function(cup_id, beacon_id, cup_info)
{
    var items = window.localStorage.getItem(this.getCurrentFileName());
    var data = JSON.parse(items);
    var j;

    for (var i = 0; i < data.nodeDataArray.length; i++) {
        var notes = data.nodeDataArray[i].notes.toString().split("\n"); //split notes
        var info;
        var new_notes;
        if (notes[0] == beacon_id) {	// Table found
            var flag = 0;
            // Check the cup is exist on the table or not
            for (j = 1; j < notes.length; j++) {
                var cupID = notes[j].split(" ");
                if (cup_id ==  cupID[0])
                    flag = 1;
            }
            if (flag == 0) {
                var cup = data.nodeDataArray[i].cup + 1;
                info = data.nodeDataArray[i].info;
                if (cup_info == 0) {
                    new_notes = data.nodeDataArray[i].notes + "\n" + cup_id + " Finish";
                    info = info + 1;
                }
                if (cup_info == 1)
                    new_notes = data.nodeDataArray[i].notes + "\n" + cup_id;
                var text = cup + "-" + info;
                ///////////////////////////
                this.remove(cup_id, i);
                this.update(i, cup, info, new_notes, text);
            }
            if (flag == 1) {
                var cup = data.nodeDataArray[i].cup;
                var notes_info = notes[j-1].split(" ");
                var notes_updated = "";
                var change = 0;
                new_notes = data.nodeDataArray[i].notes.split("\n");
                // Finish
                if (cup_info == 0) {
                    // Add Finish if non existed
                    if (notes_info.length == 1) {
                        new_notes[j-1] = new_notes[j-1] + " Finish";
                        info = data.nodeDataArray[i].info + 1;
                        var text = cup + "-" + info;
                        change = 1;
                    }
                }
                // No Finish
                else if (cup_info == 1) {
                    // Remove Finish if existed
                    if (notes_info.length == 2) {
                        new_notes[j-1] = cup_id;
                        info = data.nodeDataArray[i].info - 1;
                        var text = cup + "-" + info;
                        change = 1;
                    }
                }
                // Combine the new_notes to one string
                console.log("Notes.length = " + new_notes.length);
                for (var k = 0; k < new_notes.length; k++) {
                    if (k == 0)
                        notes_updated += new_notes[k];
                    else
                        notes_updated += ("\n" + new_notes[k]);
                }
                console.log("Notes_updated = " + notes_updated);
                console.log("Change = "+ change);
                if (change == 1)
                    this.update(i, cup, info, notes_updated, text);
            }
            break;	//Update done
        }
    }
    window.localStorage.setItem(this.getCurrentFileName(), this.floorplan.model.toJson());
}

// Get the Floorplan associated with this Floorplan Filesystem
Object.defineProperty(FloorplanFilesystem.prototype, "floorplan", {
get: function () {
        return this._floorplan;
    }
});

// Get constant name for an unsaved Floorplan
Object.defineProperty(FloorplanFilesystem.prototype, "UNSAVED_FILENAME", {
get: function () {
        return this._UNSAVED_FILENAME;
    }
});

// Get constant default model data (default Floorplan model data for a new Floorplan)
Object.defineProperty(FloorplanFilesystem.prototype, "DEFAULT_MODELDATA", {
get: function () {
        return this._DEFAULT_MODELDATA;
    }
});

// Get state information about this app's UI
Object.defineProperty(FloorplanFilesystem.prototype, "state", {
get: function () {
        return this._state;
    }
});

/*
* Helper functions
* Check Local Storage, Update File List, Open Window
*/

// Ensure local storage works in browser (not supported by MS IE/Edge)
function checkLocalStorage() {
    try {
        window.localStorage.setItem('item', 'item');
        window.localStorage.removeItem('item');
        return true;
    } catch (e) {
        return false;
    }
}

// Update listbox of files in window (for loading / removing files)
function updateFileList(id) {
    // displays cached floor plan files in the listboxes
    var listbox = document.getElementById(id);
    // remove any old listing of files
    var last;
    while (last = listbox.lastChild) listbox.removeChild(last);
    // now add all saved files to the listbox
    for (key in window.localStorage) {
        var storedFile = window.localStorage.getItem(key);
        if (!storedFile) continue;
        var option = document.createElement("option");
        option.value = key;
        option.text = key;
        listbox.add(option, null)
    }
}

// Open a specifed window element -- used for Remove / Open file windows
function openWindow(id, listid) {
    var panel = document.getElementById(id);
    if (panel.style.visibility === "hidden") {
        updateFileList(listid);
        panel.style.visibility = "visible";
    }
}

/*
* Instance methods
* New Floorplan, Save Floorplan, Save Floorplan As, Load Floorplan, Remove Floorplan
* Show Open Window, Show Remove Window
* Set Current File Name, Get Current File Name
*/

// Create new floorplan (Ctrl + D or File -> New)
FloorplanFilesystem.prototype.newFloorplan = function() {
    var floorplan = this.floorplan;
    // checks to see if all changes have been saved
    if (floorplan.isModified) {
        var save = confirm("Would you like to save changes to " + this.getCurrentFileName() + "?");
        if (save) {
            this.saveFloorplan();
        }
    }
    this.setCurrentFileName(this.UNSAVED_FILENAME);
    // loads an empty diagram
    var model = new go.GraphLinksModel;
    // initialize all modelData
    model.modelData = this.DEFAULT_MODELDATA;
    floorplan.model = model;
    floorplan.undoManager.isEnabled = true;
    floorplan.isModified = false;
    if (floorplan.floorplanUI) {
        floorplan.floorplanUI.updateUI();
        floorplan.floorplanUI.updateStatistics();
    }
}

// Save current floor plan to local storage (Ctrl + S or File -> Save)
FloorplanFilesystem.prototype.saveFloorplan = function () {
    if (checkLocalStorage()) {
        var saveName = this.getCurrentFileName();
        if (saveName === this.UNSAVED_FILENAME || saveName == null || saveName == undefined) {
            this.saveFloorplanAs();
        } else {
            window.localStorage.setItem(saveName, this.floorplan.model.toJson());
            this.floorplan.isModified = false;
        }
    }
}

// Save floor plan to local storage with a new name (File -> Save As)
FloorplanFilesystem.prototype.saveFloorplanAs = function () {
    if (checkLocalStorage()) {

        var saveName = prompt("Save file as...", this.getCurrentFileName());
        // if saveName is already in list of files, ask if overwrite is ok
        if (saveName && saveName !== this.UNSAVED_FILENAME) {
            var override = true;
            if (window.localStorage.getItem(saveName) !== null) {
                override = confirm("Do you want to overwrite " + saveName + "?");
            }
            if (override) {
                this.setCurrentFileName(saveName);
                window.localStorage.setItem(saveName, this.floorplan.model.toJson());
                this.floorplan.isModified = false;
            }
        }
    }
}

// Load floorplan model data in "Open" window (Ctrl + O or File -> Open)
FloorplanFilesystem.prototype.loadFloorplan = function () {
    var floorplan = this.floorplan;
    var listbox = document.getElementById(this.state.filesToOpenListId);
    var fileName = undefined; // get selected filename
    for (var i = 0; i < listbox.options.length; i++) {
        if (listbox.options[i].selected) fileName = listbox.options[i].text; // selected file
    }
    if (fileName !== undefined) {
        var savedFile = window.localStorage.getItem(fileName);
        this.loadFloorplanFromModel(savedFile);
        floorplan.isModified = false;
        this.setCurrentFileName(fileName);
    }
    //if (floorplan.floorplanUI) floorplan.floorplanUI.closeElement(this.state.openWindowId);
    if (floorplan.floorplanUI) floorplan.floorplanUI.hideShow(this.state.openWindowId);
}

FloorplanFilesystem.prototype.loadFloorplanFromModel = function (str) {
    var floorplan = this.floorplan;
    floorplan.model = go.Model.fromJson(str);
    console.log(floorplan);
    floorplan.skipsUndoManager = true;
    floorplan.startTransaction("generate walls");
    floorplan.nodes.each(function (node) {
        if (node.category === "WallGroup") floorplan.updateWall(node);
    });
    if (floorplan.floorplanUI) {
        floorplan.floorplanUI.updateUI();
        floorplan.floorplanUI.updateStatistics();
    }

    floorplan.commitTransaction("generate walls");
    floorplan.undoManager.isEnabled = true;

}

// Delete selected floorplan from local storage
FloorplanFilesystem.prototype.removeFloorplan = function () {
    var floorplan = this.floorplan;
    var listbox = document.getElementById(this.state.filesToRemoveListId);
    var fileName = undefined; // get selected filename
    for (var i = 0; i < listbox.options.length; i++) {
        if (listbox.options[i].selected) fileName = listbox.options[i].text; // selected file
    }
    if (fileName !== undefined) {
        // removes file from local storage
        window.localStorage.removeItem(fileName);
    }
    if (floorplan.floorplanUI) floorplan.floorplanUI.closeElement(this.state.removeWindowId);
}

// Check to see if all changes have been saved -> show the "Open" window
FloorplanFilesystem.prototype.showOpenWindow = function () {
    if (checkLocalStorage()) {
        if (this.floorplan.isModified) {
            var save = confirm("Would you like to save changes to " + this.getCurrentFileName() + "?");
            if (save) {
                this.saveFloorplan();
            }
        }
        openWindow(this.state.openWindowId, this.state.filesToOpenListId);
    }
}

// Show the Remove File window
FloorplanFilesystem.prototype.showRemoveWindow = function () {
    if (checkLocalStorage()) {
        openWindow(this.state.removeWindowId, this.state.filesToRemoveListId);
    }
}

// Add * to current file element if diagram has been modified
FloorplanFilesystem.prototype.setCurrentFileName = function (name) {
    var currentFile = document.getElementById(this.state.currentFileId);
    if (currentFile) {
        if (this.floorplan.isModified) name += "*";
        currentFile.textContent = name;
    }
}

// Get current file name from the current file element
FloorplanFilesystem.prototype.getCurrentFileName = function() {
    var currentFile = document.getElementById(this.state.currentFileId);
    if (currentFile) {
        var name = currentFile.textContent;
        if (name[name.length - 1] === "*") return name.substr(0, name.length - 1);
    }
    return name;
}

