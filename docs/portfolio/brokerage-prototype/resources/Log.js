// ===========================================================================
//  Log.js
// ===========================================================================


// ===========================================================================
//  LogWindow
// ===========================================================================
function LogWindow()
{
	if (!LogWindow.prototype.OutputString) {

		// -------------------------------------------------------------------
		//	Class properties
		// -------------------------------------------------------------------
		LogWindow.instance = null;
		LogWindow.lineNumber = 0;


		// -------------------------------------------------------------------
		//	ArrayToString
		// -------------------------------------------------------------------
		LogWindow.ArrayToString = function(
			inArray)
		{
			return "[" + inArray.join(", ") + "]";
		}


		// -------------------------------------------------------------------
		//	ObjectToString
		// -------------------------------------------------------------------
		LogWindow.ObjectToString = function(
			inObject)
		{
			var objectString = "{ ";

			for (var attribute in inObject) {
				objectString += attribute + ": " + inObject[attribute] + ", ";
			}

			objectString += " }";

			return objectString;
		}


		// -------------------------------------------------------------------
		//	OutputString
		// -------------------------------------------------------------------
		LogWindow.prototype.OutputString = function(
			inString)
		{
			this.CreateWindow();

			this.outputContainer.insertAdjacentHTML("BeforeEnd", '<pre id="Line' + 
					(LogWindow.lineNumber++) + '">' + inString + '</pre>');

			this.outputContainer.all["Line" + (LogWindow.lineNumber - 1)].scrollIntoView();
		}


		// -------------------------------------------------------------------
		//	CreateWindow
		// -------------------------------------------------------------------
		LogWindow.prototype.CreateWindow = function()
		{
				// make sure we have a valid window reference
			var newWindow = window.open("", "LogWindow", "resizable=yes,scrollbars=yes,height=300,width=500,left=10,top=10");

			if (newWindow == this.window) {
					// it's the same window as we used before, so it's already open
				return;
			}

			this.window = newWindow;

			this.window.document.open();
			this.window.document.writeln(
				'<html><head><title>Log</title><style>P { font-size: 12px; font-family: monospace }</style></head>\n' +
				'<body bgcolor="white"></body></html>\n');
			
			this.outputContainer = this.window.document.body;
		}
	}
	
		// store a static reference to this new object
	if (LogWindow.instance == null) {
		LogWindow.instance = this;
	}

	this.window = null;
	this.outputContainer = null;
}


// ===========================================================================
//  Log
// ===========================================================================
function Log()
{
	if (!LogWindow.instance) {
		new LogWindow();
	}

		// make a comma-delimited string of all the arguments
	commaString = "";

	for (var i = 0; i < arguments.length; i++) {
		switch (typeof(arguments[i])) {
			case "array":
				commaString += LogWindow.ArrayToString(arguments[i]);
				break;
				
			case "object":
				commaString += LogWindow.ObjectToString(arguments[i]);
				break;

			default:
				commaString += arguments[i];
				break;
		}

		if (i + 1 < arguments.length) {
				// it's not the last argument, so add a comma
			commaString += ", ";
		}
	}

	LogWindow.instance.OutputString(commaString);
}