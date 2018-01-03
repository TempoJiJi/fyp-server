// UI Interaction state object for FlooplaUI
GUI_STATE = {
				menuButtons: {
					selectionInfoWindowButtonId: "selectionInfoWindowButton",
					palettesWindowButtonId: "myPaletteWindowButton",
					overviewWindowButtonId: "myOverviewWindowButton",
					optionsWindowButtonId: "optionsWindowButton",
					statisticsWindowButtonId: "statisticsWindowButton"
				},
				windows: {
					diagramHelpDiv: {
						id: "diagramHelpDiv"
					},
					selectionInfoWindow: {
						id: "selectionInfoWindow",
						textDivId: "selectionInfoTextDiv",
						handleId: "selectionInfoWindowHandle",
						colorPickerId: "colorPicker",
						heightLabelId: "heightLabel",
						heightInputId: "heightInput",
						widthInputId: "widthInput",
						nodeGroupInfoId: "nodeGroupInfo",
						nameInputId: "nameInput",
						notesTextareaId: "notesTextarea"
					},
					palettesWindow:{
							id: "myPaletteWindow",
							furnitureSearchInputId: "furnitureSearchBar",
							furniturePaletteId: "furniturePaletteDiv"
					},
					overviewWindow: {
							id: "myOverviewWindow"
					},
					optionsWindow: {
						id: "optionsWindow",
						gridSizeInputId: "gridSizeInput",
						unitsFormId: "unitsForm",
						unitsFormName: "units",
							checkboxes: {
								showGridCheckboxId: "showGridCheckbox",
								gridSnapCheckboxId: "gridSnapCheckbox",
								wallGuidelinesCheckboxId: "wallGuidelinesCheckbox",
								wallLengthsCheckboxId: "wallLengthsCheckbox",
								wallAnglesCheckboxId: "wallAnglesCheckbox",
								smallWallAnglesCheckboxId: "smallWallAnglesCheckbox"
						},
					},
					statisticsWindow: {
						id: "statisticsWindow",
						textDivId: "statisticsWindowTextDiv",
						numsTableId: "numsTable",
						totalsTableId: "totalsTable"
					}
				},
				scaleDisplayId: "scaleDisplay",
				setBehaviorClass: "setBehavior",
				wallThicknessInputId: "wallThicknessInput",
				wallThicknessBoxId: "wallThicknessBox",
				unitsBoxClass: "unitsBox",
				unitsInputClass: "unitsInput"
};

// Filesystem state object for FloorplanFilesystem
FILESYSTEM_UI_STATE = {
	openWindowId: "openDocument",
	removeWindowId: "removeDocument",
	currentFileId: "currentFile",
	filesToRemoveListId: "filesToRemove",
	filesToOpenListId: "filesToOpen"
};

// Node Data Array for Furniture Palette
FURNITURE_NODE_DATA_ARRAY = [
			  {
				  category: "MultiPurposeNode",
				  key: "MultiPurposeNode",
				  caption: "Multi Purpose Node",
				  color: "#ffffff",
				  stroke: '#000000',
				  name: "Writable Node",
				  type: "Writable Node",
				  shape: "Rectangle",
				  text: "0-0",
				  cup: 0,
                  info: 0,
				  width: 60,
				  height: 60,
				  notes: ""
			  },
			  /*{
				  key: "roundTable",
				  color: "#ffffff",
				  stroke: '#000000',
				  caption: "Round Table",
				  type: "Round Table",
				  shape: "Ellipse",
				  width: 60,
				  height: 60,
				  text: "jfklsajfkla",
				  cup: 0,
				  notes: ""
			  },*/
];

// Node Data Array for Wall Parts Palette
WALLPARTS_NODE_DATA_ARRAY = [
				{
					category: "PaletteWallNode",
					key: "wall",
					caption: "Wall",
					type: "Wall",
					color: "#000000",
					shape: "Rectangle",
					height: 10,
					length: 60,
					notes: "",
				},
				{
					category: "WindowNode",
					key: "window",
					color: "white",
					caption: "Window",
					type: "Window",
					shape: "Rectangle",
					height: 10,
					length: 60,
					notes: ""
				},
				{
					key: "door",
					category: "DoorNode",
					color: "rgba(0, 0, 0, 0)",
					caption: "Door",
					type: "Door",
					length: 40,
					doorOpeningHeight: 5,
					swing: "left",
					notes: ""
				}
			];
