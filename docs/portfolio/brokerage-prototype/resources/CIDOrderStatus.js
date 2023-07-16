// ===========================================================================
//  CIDOrderStatus.js
// ===========================================================================


// ===========================================================================
//	CIDOrderMarker
// ===========================================================================
function CIDOrderMarker(
	inStatusBar,
	inWindow,
	inID,
	inOrderInfo)
{
	if (!CIDOrderMarker.prototype.Write) {
		// -------------------------------------------------------------------
		//	Class properties
		// -------------------------------------------------------------------
		CIDOrderMarker.prototype.gTopLayer = 10;
		CIDOrderMarker.prototype.kFillBarWidth = 30;
		
		CIDOrderMarker.prototype.kProgressBar_Open = "resources/images/progress-bar.gif";
		CIDOrderMarker.prototype.kProgressBar_Closed = "resources/images/progress-bar-closed.gif";
		
		CIDOrderMarker.prototype.kBorderColor_Open = "#FFFFFF";
		CIDOrderMarker.prototype.kBorderColor_Active = "#FF9C18";
		CIDOrderMarker.prototype.kBorderColor_Closed = "#BABABA";

		
		// -------------------------------------------------------------------
		//	Write
		// -------------------------------------------------------------------
		CIDOrderMarker.prototype.Write = function()
		{
			var doc = this.window.document;
			
			var html = '<div id="' + this.id + 
					'" style="position:absolute; border: 2px solid white; ' + 
					'height: 22px; left: 0px; top: 0px; z-index: ' + 
					CIDOrderMarker.prototype.gTopLayer++ + 
					'; color: black; background-color: #D6DECE; layer-background-color: #D6DECE">';

			html += '<table border="0" cellpadding="0" cellspacing="0"><tr>' + 
					'<td align="right" width="25"><span class="Action_' + 
					this.action + '">' + this.action + '</span></td>\n';

			html += '<td width="34" align="center">' + this.quantity + '</td>\n';

			html += '<td><span class="Symbol">' + this.symbol + '</span></td>\n';
			
			html += '</tr>\n';
			
			html += '<tr valign="middle">\n';
			
			html += '<td align="right" valign="middle" width="25"><span class="Timing">' + 
					((this.timing != "DAY") ? this.timing : "") + '&nbsp;</span></td>\n';

// IE on Windows doesn't seem to respect the height attribute 
// 			html += '<td width="34" align="left" valign="middle"><div style="align: left; width: 30; height: 9; clip: rect(10px 0 px 19px 0px); background-color: white; ' + 
// 					'border: 1px solid #666666">\n';

			html += '<td width="34" align="left" valign="middle"><div style="align: left; width: 30; height: 9; background-color: white; ' + 
					'border: 1px solid #666666">\n';
					
// 			html += '<div id="FillBar" style="width: ' + 
// 					(this.filled / this.quantity) * this.kFillBarWidth +
// 					'; height: 9; background-color: #CCCCFF"></div></div></td>\n';

			html += '<img id="FillBar" src="' + this.kProgressBar_Open + '" border="0" height="9" width="' + 
					(this.filled / this.quantity) * this.kFillBarWidth + '"></div></td>\n';

// 			html += '<span id="FillBar" style="width: ' + 
// 					(this.filled / this.quantity) * this.kFillBarWidth +
// 					'; height: 9; background-color: #CCCCFF"></span></div></td>\n';

			if (this.pricing == "MKT" && this.filled > 0) {
				html += '<td valign="middle">&nbsp;<span id="LastFillPrice">' + 
						this.lastFillPrice + 
						'</span><span class="Pricing">&nbsp;</span></td>\n';
			} else if (this.pricing == "LIM") {
				html += '<td valign="middle">&nbsp;' + this.limitPrice + 
						'&nbsp;<span class="Pricing">' + 
						this.pricing + '</span></td>\n';
			} else {
				html += '<td valign="middle">&nbsp;<span id="LastFillPrice">&nbsp;</span><span class="Pricing">&nbsp;</span></td>\n';
			}

			html += '</tr>\n</table>\n';

			html += '</div>\n';
					
			doc.writeln(html);
			
			this.element = this.window.document.all[this.id];
			this.style = this.element.style;
		}
		

		// -------------------------------------------------------------------
		//	UpdateFilled
		// -------------------------------------------------------------------
		CIDOrderMarker.prototype.UpdateFilled = function()
		{
				// fill a randomly sized portion of the order, up to this.quantity
			this.filled = Math.min(this.quantity, 
					this.filled + (Math.round(Math.random() * this.lotsPerFillRange) + 1) * 
					this.lotSize);

			var newWidth = Math.round((this.filled / this.quantity) * this.kFillBarWidth);

				// make sure there's at least 1 pixel of whitespace if we're
				// not filled yet
			if (newWidth == this.kFillBarWidth && this.filled < this.quantity) {
				newWidth = this.kFillBarWidth - 1;
			}

				// update the fill bar in the marker
			this.element.all.FillBar.style.width = newWidth;
			
				// update the fill price
			if (this.pricing == "MKT") {
				this.lastFillPrice += Math.round(Math.random() * this.fillPriceRange) * 
						0.05 * ((this.action == "B") ? 1.0 : -1.0);

				this.element.all.LastFillPrice.innerText = CIDUtil.FormatNumber(this.lastFillPrice, 2);

				this.lastFillPrice = parseFloat(CIDUtil.FormatNumber(this.lastFillPrice, 2));
			}
			
				// let the status bar know we've changed
			this.statusBar.MarkerChanged(this);

			if (this.filled < this.quantity) {
					// create a local variable to store a reference to this
					// so that the function will be able to access it
				var marker = this;
				
					// call our UpdateFilled method in a random number of milliseconds
				CIDScheduler.ScheduleEvent(
					function() { marker.UpdateFilled(); },
					(Math.random() * this.fillDelayRange) + 5000);
			} else {
				this.style.backgroundColor = "#E6E6E6";
				this.style.borderColor = this.kBorderColor_Active;
				this.style.color = "#666666";
				this.element.all.FillBar.src = this.kProgressBar_Closed;

				var marker = this;
				CIDScheduler.ScheduleEvent(
					function() { marker.style.borderColor = marker.kBorderColor_Closed; },
					1000);
			}
		}
		

		// -------------------------------------------------------------------
		//	SetPosition
		// -------------------------------------------------------------------
		CIDOrderMarker.prototype.SetPosition = function(
			inX,
			inY)
		{
			this.style.pixelLeft = inX;
			this.style.pixelTop = inY;
		}
		

		// -------------------------------------------------------------------
		//	GetPosition
		// -------------------------------------------------------------------
		CIDOrderMarker.prototype.GetPosition = function()
		{
			return [this.style.pixelLeft, this.style.pixelTop];
		}
		

		// -------------------------------------------------------------------
		//	GetWidth
		// -------------------------------------------------------------------
		CIDOrderMarker.prototype.GetWidth = function()
		{
			return this.element.offsetWidth;
		}
		

		// -------------------------------------------------------------------
		//	GetHeight
		// -------------------------------------------------------------------
		CIDOrderMarker.prototype.GetHeight = function()
		{
			return this.element.offsetHeight;
		}
	}

	this.statusBar = inStatusBar;
	this.window = inWindow;
	this.id = inID;
	
	this.action = "";
	this.quantity = 0;
	this.filled = 0;
	this.symbol = "";
	this.pricing = "MKT";
	this.timing = "DAY";
	this.limitPrice = 0;
	this.stopPrice = 0;
	this.lastFillPrice = 0;

	this.lotSize = 100;
	this.lotsPerFillRange = 3;
	this.fillPriceRange = 3;
	this.fillDelayRange = 10000;

		// initialize our attributes to whichever were passed in via the object
	for (var attribute in inOrderInfo) {
		this[attribute] = inOrderInfo[attribute];
	}
}


// ===========================================================================
//	CIDStatusBar
// ===========================================================================
function CIDStatusBar(
	inWindow)
{
	if (!CIDStatusBar.prototype.CreateMarker) {
		
		// -------------------------------------------------------------------
		//	CreateMarker
		// -------------------------------------------------------------------
		CIDStatusBar.prototype.CreateMarker = function(
			inID,
			inOrderInfo)
		{
			this.markers[this.markers.length] = 
					new CIDOrderMarker(this, this.window, inID, inOrderInfo);
/*
			this.markers[this.markers.length - 1].Write();
			this.markers[this.markers.length - 1].UpdateFilled();
*/
		}
		

		// -------------------------------------------------------------------
		//	WriteMarkers
		// -------------------------------------------------------------------
		CIDStatusBar.prototype.WriteMarkers = function()
		{
			for (var i in this.markers) {
				this.markers[i].Write();
// 				this.markers[i].UpdateFilled();
			}
// 			for (var i in this.markers) {
// 				this.markers[i].UpdateFilled();
// 			}
// alert("done with WriteMarkers");			
		}
		

		// -------------------------------------------------------------------
		//	GetIndexByID
		// -------------------------------------------------------------------
		CIDStatusBar.prototype.GetIndexByID = function(
			inID)
		{
			for (var i in this.markers) {
				if (this.markers[i].id == inID) {
					return i;
				}
			}
			
			return -1;
		}
		

		// -------------------------------------------------------------------
		//	GetMarkerByID
		// -------------------------------------------------------------------
		CIDStatusBar.prototype.GetMarkerByID = function(
			inID)
		{
			for (var i in this.markers) {
				if (this.markers[i].id == inID) {
					return this.markers[i];
				}
			}
			
			return null;
		}
		

		// -------------------------------------------------------------------
		//	GetMarkerIndex
		// -------------------------------------------------------------------
		CIDStatusBar.prototype.GetMarkerIndex = function(
			inMarker)
		{
			for (var index in this.markers) {
				if (this.markers[index] == inMarker) {
					return index;
				}
			}
			
			return -1;
		}
		

		// -------------------------------------------------------------------
		//	MarkerChanged
		// -------------------------------------------------------------------
		CIDStatusBar.prototype.MarkerChanged = function(
			inActiveMarker,
			inMetaState)
		{
// check for critical markers			
			
			var index = this.GetMarkerIndex(inActiveMarker);

// why doesn't this work?

// 			this.markers = [inActiveMarker].concat(
// 					this.markers.slice(0, index),
// 					this.markers.slice(index + 1));
// // 					this.markers.slice(index + 1, this.markers.length + 1));

// using a loop to create the new markers list is bunk, but it works

				// create new array with activeMarker at the front
			var i = 1;
			var newMarkers = [inActiveMarker];
			
			for (m in this.markers ) {
				if (this.markers[m] != inActiveMarker) {
					newMarkers[i++] = this.markers[m];
				}
			}

				// save the new array of markers
			this.markers = newMarkers;

			this.ArrangeMarkers();
		}
		

		// -------------------------------------------------------------------
		//	ArrangeMarkers
		// -------------------------------------------------------------------
		CIDStatusBar.prototype.ArrangeMarkers = function()
		{
			var x = this.activityHomeX;

			for (var i in this.markers) {
		 		var marker = this.markers[i];

				marker.SetPosition(x, this.activityHomeY);

				x += marker.GetWidth() + this.markerOffset;
			}
		}
	}
	
	this.window = inWindow;
	this.markers = new Array();
	
	this.activityHomeX = 250;
	this.activityHomeY = 681;
	this.criticalHomeX = 10;
	this.criticalHomeY = 10;

/*
var gVer4 = parseInt(navigator.appVersion) >= 4;
var gNN = (navigator.appName == "Netscape");
var gIE = (navigator.userAgent.indexOf("MSIE") != -1);
var gNN4 = ((navigator.appName == "Netscape") && gVer4);
var gIE4 = ((navigator.userAgent.indexOf("MSIE") != -1) && gVer4);
var gMac = (navigator.userAgent.indexOf("Mac") != -1);
*/
	
	this.markerOffset = ((navigator.userAgent.indexOf("Mac") != -1) ? 7 : 4);
}


