// ===========================================================================
//  CIDResultsArea.js
// ===========================================================================

/* ===========================================================================

To Do:
	* use setExpression() to auto update the security tables when the data changes
	* create a Stream object to send either real or fake data to the securities.
	  that way, the results area and securities don't have to know which is which.

Done:
	* quotes.php3 doesn't return anything if the symbol is wrong, so we can't
	  tell when the user enters a bad symbol.
	* if the symbol isn't found, open a new window pointing at Yahoo's symol 
	  lookup page.

   ======================================================================== */


// ===========================================================================
//	CIDSecurity
// ===========================================================================
// 
// a CIDSecurity should be created only after the <body> has finished loading
//
function CIDSecurity(
	inResultsArea,
	inContainer,
	inSecurityInfo)
{
	if (!CIDSecurity.prototype.Write) {
		// -------------------------------------------------------------------
		//	Class properties
		// -------------------------------------------------------------------
		CIDSecurity.prototype.gTopLayer = 100;
		CIDSecurity.prototype.kChangeBarWidth = 40;
		CIDSecurity.prototype.kVolumeBarWidth = 40;
		CIDSecurity.prototype.kDayRangeBarWidth = 50;
		
		CIDSecurity.prototype.kChangeBar_Positive = "resources/images/change-bar-green.gif";
		CIDSecurity.prototype.kChangeBar_Negative = "resources/images/change-bar-red.gif";

		CIDSecurity.prototype.kColor_Positive = "rgb(40 200 40)";
		CIDSecurity.prototype.kColor_Negative = "rgb(222 38 38)";
		CIDSecurity.prototype.kColor_Plain = "rgb(186 175 158)";
		CIDSecurity.prototype.kColor_ZeroBar = "rgb(102 102 102)";

		CIDSecurity.prototype.kBarMatching_0 = "#F7F7F7";
		CIDSecurity.prototype.kBarMatching_1 = "#FFFFFF";
		CIDSecurity.prototype.kBarNonMatching_0 = "#DEDEDE";
		CIDSecurity.prototype.kBarNonMatching_1 = "#E6E6E6";
		CIDSecurity.prototype.kBarSelected = "#C4C4D3";


		// -------------------------------------------------------------------
		//	Write
		// -------------------------------------------------------------------
		CIDSecurity.prototype.Write = function(
			inContainer)
		{
			var html = '<div id="' + this.id + 
					'" valign="middle" style="position: absolute; vertical-align: middle; ' + 
					'left: 0px; top: 0px; width: ' + (inContainer.offsetWidth - 16) + 
					'px; height: 24; z-index: ' + 
					CIDSecurity.prototype.gTopLayer++ + 
					'; color: black; font-size: 12px; background-color: ' + 
					this.kBarMatching_0 + '" onclick="this.oSecurity.Click(); return true;" ' + 
					'onmousemove="this.oSecurity.resultsArea.OnMouseMove()" ' + 
					'onselectstart="event.returnValue = false; event.cancelBubble = true; return false;">';

				// table
			html += '<table id="RowTable" border="0" cellpadding="0" cellspacing="0" style="position: absolute; left: 60; top: 4px; "><tr valign="middle">' + 
					'<td align="left" width="40">' + this.symbol + '</td>' + 
					'<td width="15" align="right"><img style="position: absolute; top: -4px; width: 1px; height: 24px;" src="resources/images/dot-white.gif"></td>\n';

				// Last
			html += '<td width="65" align="right" id="Last" style="color: ' + 
					((this.change == 0) ? "black" : 
					((this.change > 0) ? this.kColor_Positive : this.kColor_Negative)) + '">' + 
					CIDUtil.FormatNumber(this.change, 2) + '</td>\n' + 
					'<td width="10" align="right"><img style="position: absolute; top: -4px; width: 1px; height: 24px; margin-right: 5px" src="resources/images/dot-white.gif"></td>\n';

				// Change
			html += '<td id="Change" width="55" align="right" style="color: ' + 
					((this.change == 0) ? "black" : 
					((this.change > 0) ? this.kColor_Positive : this.kColor_Negative)) + '">' + 
					CIDUtil.FormatNumber(this.change, 2) + '</td>\n' + 
					'<td width="8">&nbsp;</td>\n';
					
				// ChangeBar
			html += '<td id="ChangeBarCell" width="51" align="left" valign="middle">\n' + 
						'<span id="ChangeBar" style="position: absolute; ' + 
							'left: 0px; top: 3px; width: 1px; height: 12px; ' + 
							'background-color: ' + this.kColor_Negative + '; ">' + 
							'<img src="resources/images/dot-clear.gif" height="1" width="1"></span>' + 
						'<img id="ChangeLeftBar" src="resources/images/dotted-line.gif" style="position: absolute; left: 0px; top: 1px;">' + 
						'<img id="ChangeRightBar" src="resources/images/dotted-line.gif" style="position: absolute; left: 0px; top: 1px;">' + 
						'<span id="Change0Bar" style="position: absolute; left: 0px; top: 1px; height: 16px; width: 1px; background-color: ' + this.kColor_ZeroBar + '">' +
							'<img src="resources/images/dot-clear.gif" height="1" width="1"></span>' + 
					'</td>\n' + 
					'<td width="2" align="right"><img style="position: absolute; top: -4px; width: 1px; height: 24px;" src="resources/images/dot-white.gif"></td>\n';

				// Volume
			html += '<td id="Volume" width="78" align="right" valign="middle">\n' + 
					CIDUtil.FormatNumber(this.volume, 0, true) + '</td>\n' + 
					'<td width="8">&nbsp;</td>\n';

			html += '<td id="VolumeBarCell" width="47" title="Average volume: ">\n' + 
						'<span id="VolumeBar" style="position: relative; left: 0px; top: 1px; width: 1px; height: 12px; background-color: rgb(186 175 158)">' + 
						'<img src="resources/images/dot-clear.gif" height="1" width="1"></span>' + 
						'<img id="VolumeRightBar" src="resources/images/dotted-line.gif" style="position: absolute; left: 0px; top: 1px;">' + 
						'<span id="Volume100Bar" style="position: absolute; left: 0px; top: 1px; height: 16px; width: 1px; background-color: rgb(166 116 49)">' + 
						'<img src="resources/images/dot-clear.gif" height="1" width="1"></span>' + 
						'<span id="Volume0Bar" style="position: absolute; left: -1px; top: 1px; height: 16px; width: 1px; background-color: ' + this.kColor_ZeroBar + '">' +
						'<img src="resources/images/dot-clear.gif" height="1" width="1"></span>' + 
					'</td>\n' +
					'<td width="4" align="right"><img style="position: absolute; top: -4px; width: 1px; height: 24px;" src="resources/images/dot-white.gif"></td>\n';

				// DayLow
			html += '<td id="DayLow" width="65" align="right" valign="middle">\n' + 
					CIDUtil.FormatNumber(this.dayLow, 2) + '</td>\n' + 
					'<td width="10" align="right"><img style="position: absolute; top: -4px; width: 1px; height: 24px;" src="resources/images/dot-white.gif"></td>\n' +
					'<td width="65">&nbsp;</td>\n' + 
					'<td width="10" align="right"><img style="position: absolute; top: -4px; width: 1px; height: 24px;" src="resources/images/dot-white.gif"></td>\n';

				// DayHigh
			html += '<td id="DayHigh" width="65" align="right" valign="middle">\n' + 
					CIDUtil.FormatNumber(this.dayHigh, 2) + '</td>\n' + 
					'<td width="10" align="right"><img style="position: absolute; top: -4px; width: 1px; height: 24px;" src="resources/images/dot-white.gif"></td>\n';

				// YearLow
			html += '<td id="YearLow" width="65" align="right" valign="middle">\n' + 
					CIDUtil.FormatNumber(this.yearLow, 2) + '</td>\n' + 
					'<td width="10" align="right"><img style="position: absolute; top: -4px; width: 1px; height: 24px;" src="resources/images/dot-white.gif"></td>\n' +
					'<td width="65">&nbsp;</td>\n' + 
					'<td width="10" align="right"><img style="position: absolute; top: -4px; width: 1px; height: 24px;" src="resources/images/dot-white.gif"></td>\n';

				// YearHigh
			html += '<td id="YearHigh" width="65" align="right" valign="middle">\n' + 
					CIDUtil.FormatNumber(this.yearHigh, 2) + '</td>\n' + 
					'<td width="10" align="right"><img style="position: absolute; top: -4px; width: 1px; height: 24px;" src="resources/images/dot-white.gif"></td>\n';
/*
				// Bid
			html += '<td id="Bid" width="52" align="right" valign="middle">\n' + 
					CIDUtil.FormatNumber(this.bid, 2) + '</td>\n' + 
					'<td width="12" align="right"><img style="position: absolute; top: -4px; width: 1px; height: 24px;" src="resources/images/dot-white.gif"></td>\n';

				// Ask
			html += '<td id="Ask" width="52" align="right" valign="middle">\n' + 
					CIDUtil.FormatNumber(this.ask, 2) + '</td>\n' + 
					'<td width="12" align="right"><img style="position: absolute; top: -4px; width: 1px; height: 24px;" src="resources/images/dot-white.gif"></td>\n';
*/
			html += '</tr>\n</table>\n';

				// DayRangeBar
			html += '<v:group id="DayRangeBar"\n' + 
							'style="position: absolute; width: 50px; height: 12px; left: 531px; top: 7px;"\n' + 
							'coordsize="50,12"' + 
							'>' + 
						'<v:rect id="BelowCloseBar"\n' + 
							'style="position: absolute; left: 0; top: 3; width: 25; height: 4"\n' + 
							'fillcolor="' + this.kColor_Negative + '"\n' + 
							'stroked="no"\n' + 
						'/>\n' + 
						'<v:rect id="AboveCloseBar"\n' + 
							'style="position: absolute; left: 25; top: 3; width: 25; height: 4"\n' + 
							'fillcolor="' + this.kColor_Positive + '"\n' + 
							'stroked="no"\n' + 
						'/>\n' + 
						'<v:line id="CloseMarker"\n' + 
							'from="0,-2"' + 
							'to="0,12"' + 
							'strokecolor="' + this.kColor_ZeroBar + '"\n' +
						'/>\n' + 
						'<v:shape id="OpenMarker"\n' + 
							'style="position: absolute; left: 0; top: -2; width: 8; height: 4;"\n' + 
							'coordsize="8,4"\n' + 
							'coordorigin="4,0"\n' + 
							'path="m 0,0  l 8,0,  4,4  x e"\n' + 
							'fillcolor="white"\n' + 
							'strokeweight="1px"\n' + 
						'/>\n' + 
						'<v:shape id="LastMarker"\n' + 
/*
							'style=" left: 0; top: 12; width: 8; height: 4;"\n' + 
							'coordsize="8,4"\n' + 
							'coordorigin="4,0"\n' + 
							'path="m 0,0  l 8,0,  4,-4  x e"\n' + 
*/
							'style="position: absolute; left: 0; top: 10; width: 10; height: 5;"\n' + 
							'coordsize="10,5"\n' + 
							'coordorigin="5,0"\n' + 
							'path="m 0,0  l 10,0,  5,-5  x e"\n' + 
							'fillcolor="yellow"\n' + 
							'strokeweight="1px"\n' + 
						'/>\n' + 
					'</v:group>\n';

				// YearRangeBar
			html += '<v:group id="YearRangeGroup"\n' + 
							'style="position: absolute; width: 50px; height: 12px; left: 756px; top: 7px;"\n' + 
							'coordsize="50,12">\n' + 
						'<v:rect id="YearRangeBar"\n' + 
							'style="position: absolute; left: 0; top: 3; width: 50; height: 4"\n' + 
							'fillcolor="' + this.kColor_Plain + '"\n' + 
							'stroked="no"\n' + 
						'/>\n' + 
						'<v:shape id="YearLastMarker"\n' + 
							'style="position: absolute; left: 0; top: 10; width: 10; height: 5;"\n' + 
							'coordsize="10,5"\n' + 
							'coordorigin="5,0"\n' + 
							'path="m 0,0  l 10,0,  5,-5  x e"\n' + 
							'fillcolor="yellow"\n' + 
							'strokeweight="1px"\n' + 
						'/>\n' + 
					'</v:group>\n';

			CIDSecurity.prototype.gTopLayer += 10;

			html += '<img style="position: absolute; left: 49; top: 0; width: 1; height: 24; z-index: ' + CIDSecurity.prototype.gTopLayer++ + '" src="resources/images/dot-white.gif">\n';

			html += '</div>\n';
					
			inContainer.insertAdjacentHTML("BeforeEnd", html);
			
			this.element = inContainer.all[this.id];
			this.style = this.element.style;

			this.element.oSecurity = this;
		}
		

		// -------------------------------------------------------------------
		//	UpdatePrice
		// -------------------------------------------------------------------
		CIDSecurity.prototype.UpdatePrice = function()
		{
				// update change
			this.change = this.last - this.previousClose;
			this.element.all.Change.innerText = CIDUtil.FormatNumber(this.change, 2);
			this.element.all.Change.style.color = ((this.change == 0) ? "black" : 
					((this.change > 0) ? this.kColor_Positive : this.kColor_Negative));

				// update price
			this.last += Math.round(Math.random() * this.priceChangeRange * this.vega) * 
					0.05 * ((Math.round(Math.random() + .00000000000001) == 0) ? -1.0 : 1.0);
			this.last = parseFloat(CIDUtil.FormatNumber(this.last, 2));
			this.element.all.Last.innerText = CIDUtil.FormatNumber(this.last, 2);
			this.element.all.Last.style.color = ((this.change == 0) ? "black" : 
					((this.change > 0) ? this.kColor_Positive : this.kColor_Negative));

				// update volume
			this.volume = Math.round(this.volume + Math.random() * this.volumeChangeRange);
			this.element.all.Volume.innerText = CIDUtil.FormatNumber(this.volume, 0, true);

			this.volumePercentage = this.volume / this.averageVolume;
			this.element.all.VolumeBar.style.width = (this.volume / this.averageVolume) * this.kVolumeBarWidth;

				// update bid and ask
			this.bid = this.last - 0.05;
			this.ask = this.last + 0.05;
			this.element.all.Bid.innerText = CIDUtil.FormatNumber(this.bid, 2);
			this.element.all.Ask.innerText = CIDUtil.FormatNumber(this.ask, 2);

				// update high and low
			if (this.last > this.dayHigh) {
				this.dayHigh = this.last;
				this.element.all.DayHigh.style.fontWeight = "bold";

					// return font weight to normal in 1.5 seconds
				var security = this;
				CIDScheduler.ScheduleEvent(
					function() { security.element.all.DayHigh.style.fontWeight = "normal"; },
					1500);
			}

			if (this.last < this.dayLow) {
				this.dayLow = this.last;
				this.element.all.DayLow.style.fontWeight = "bold";

					// return font weight to normal in 1.5 seconds
				var security = this;
				CIDScheduler.ScheduleEvent(
					function() { security.element.all.DayLow.style.fontWeight = "normal"; },
					1500);
			}

			this.element.all.DayHigh.innerText = CIDUtil.FormatNumber(this.dayHigh, 2);
			this.element.all.DayLow.innerText = CIDUtil.FormatNumber(this.dayLow, 2);

				// let the results area know we've changed
			this.resultsArea.SecurityChanged(this);

				// create a local variable to store a reference to this
				// so that the function will be able to access it
			var security = this;
			
				// call our UpdatePrice method in a random number of milliseconds
			CIDScheduler.ScheduleEvent(
				function() { security.UpdatePrice(); },
				(Math.random() * this.changeDelayRange) + 4000);
		}
		

		// -------------------------------------------------------------------
		//	UpdateVolumeBar
		// -------------------------------------------------------------------
		CIDSecurity.prototype.UpdateVolumeBar = function(
			inMaxVolumePercentage)
		{
			if (this.averageVolume < 1) {
				this.element.all.VolumeBar.style.visibility = "hidden";
				this.element.all.Volume100Bar.style.visibility = "hidden";
				this.element.all.Volume0Bar.style.visibility = "hidden";
				this.element.all.VolumeRightBar.style.visibility = "hidden";

				return;
			}

			var newWidth = Math.round((this.volumePercentage / inMaxVolumePercentage) * this.kVolumeBarWidth);
			
				// ensure the bar is at least 1 pixel
			newWidth = Math.max(newWidth, 1);

			this.element.all.VolumeBar.style.width = newWidth;

			this.element.all.Volume0Bar.style.pixelLeft = 
					this.element.all.VolumeBar.offsetLeft - 1;

			this.element.all.VolumeRightBar.style.pixelLeft = 
					this.element.all.VolumeBar.offsetLeft + this.kVolumeBarWidth;

			this.element.all.Volume100Bar.style.pixelLeft = 
					this.element.all.VolumeBar.offsetLeft + ((1 / inMaxVolumePercentage) * this.kVolumeBarWidth);

			this.element.all.VolumeBarCell.title = CIDUtil.FormatNumber((this.volume / this.averageVolume) * 100, 0, true) + "% of average (" + 
					CIDUtil.FormatNumber(this.averageVolume, 0, true) + ")";
		}
		

		// -------------------------------------------------------------------
		//	UpdateChangeBar
		// -------------------------------------------------------------------
		CIDSecurity.prototype.UpdateChangeBar = function(
			inMaxChangeNeg,
			inMaxChangePos,
			inChangeRange)
		{
			if (this.isIndex) {
					// this is an index, so don't show its change bar
				this.element.all.ChangeBar.style.visibility = "hidden";
				this.element.all.ChangeLeftBar.style.visibility = "hidden";
				this.element.all.ChangeRightBar.style.visibility = "hidden";
				this.element.all.Change0Bar.style.visibility = "hidden";

				return;
			}

			var newWidth = (Math.abs(this.change) / inChangeRange) * this.kChangeBarWidth;
			
			if (this.change != 0) {
					// as long as change is nonzero, ensure the bar is at least 1 pixel
				newWidth = Math.max(newWidth, 1);
			}

			this.element.all.ChangeLeftBar.style.pixelLeft = 
					this.element.all.ChangeBarCell.offsetLeft - 1;

				// leave an extra pixel to account for the zero-bar
			this.element.all.ChangeRightBar.style.pixelLeft = 
					this.element.all.ChangeBarCell.offsetLeft + this.kChangeBarWidth + 1;

				// position the zero bar where the max negative bar ends
			this.element.all.Change0Bar.style.pixelLeft = 
					this.element.all.ChangeBarCell.offsetLeft + 
					Math.floor((Math.abs(inMaxChangeNeg) / inChangeRange) * this.kChangeBarWidth);
			
				// color and position the bar
			if (this.change < 0) {
					// all negative changes lose the fractional bit of newWidth
				newWidth = Math.floor(newWidth);
				this.element.all.ChangeBar.style.pixelLeft = 
						this.element.all.Change0Bar.style.pixelLeft - newWidth;
				this.element.all.ChangeBar.style.backgroundColor = this.kColor_Negative;
				this.element.all.ChangeBar.style.visibility = "visible";
			} else if (this.change > 0) {
					// all positive changes get the fractional bit of newWidth 
					// from the negative ones
				newWidth = Math.ceil(newWidth);
				this.element.all.ChangeBar.style.pixelLeft = 
						this.element.all.Change0Bar.style.pixelLeft + 1;
				this.element.all.ChangeBar.style.backgroundColor = this.kColor_Positive;
				this.element.all.ChangeBar.style.visibility = "visible";
			} else {
				this.element.all.ChangeBar.style.visibility = "hidden";
			}

		 	this.element.all.ChangeBar.style.width = newWidth;

				// update tooltips with percentage change
			this.element.all.Change.title = "Change: " + (this.changePercent > 0 ? "+" : "") + 
					this.changePercent + "%";
			this.element.all.ChangeBarCell.title = "Change: " + (this.changePercent > 0 ? "+" : "") + 
					this.changePercent + "%";
		}
		

		// -------------------------------------------------------------------
		//	UpdateInfo
		// -------------------------------------------------------------------
		CIDSecurity.prototype.UpdateInfo = function(
			inSecurityInfo)
		{
			var oldHigh = this.dayHigh;
			var oldLow = this.dayLow;
			var oldYearHigh = this.yearHigh;
			var oldYearLow = this.yearLow;

			for (var attribute in inSecurityInfo) {
				this[attribute] = inSecurityInfo[attribute];
			}

			this.element.all.Last.innerText = CIDUtil.FormatNumber(this.last, 2, true);
			this.element.all.Last.style.color = ((this.change == 0) ? "black" : 
					((this.change > 0) ? this.kColor_Positive : this.kColor_Negative));

				// update change
			this.element.all.Change.innerText = ((this.change > 0) ? "+" : "") + 
					CIDUtil.FormatNumber(this.change, 2, true);
			this.element.all.Change.style.color = ((this.change == 0) ? "black" : 
					((this.change > 0) ? this.kColor_Positive : this.kColor_Negative));

				// update volume
			this.element.all.Volume.innerText = 
					(typeof(this.volume) == "number" && this.volume > 0) ? 
					CIDUtil.FormatNumber(this.volume, 0, true) : "";

				// update average volume
			if (typeof(this.averageVolume) == "number" && (this.averageVolume > 0)) {
				this.volumePercentage = this.volume / this.averageVolume;
			} else {
				this.averageVolume = 0;
			}

			if (typeof(this.open) == "string") {
					// for some reason we're not getting the correct open price, 
					// so just default to the last close so that the item doesn't break
				this.open = this.previousClose;
			}

				// update bid and ask
//			this.element.all.Bid.innerText = (this.bid == "N/A") ? "" : CIDUtil.FormatNumber(this.bid, 2);
//			this.element.all.Ask.innerText = (this.ask == "N/A") ? "" : CIDUtil.FormatNumber(this.ask, 2);

			this.element.all.DayHigh.innerText = CIDUtil.FormatNumber(this.dayHigh, 2, true);
			this.element.all.DayLow.innerText = CIDUtil.FormatNumber(this.dayLow, 2, true);

				// update high and low
			if (this.dayHigh > oldHigh) {
				this.element.all.DayHigh.style.fontWeight = "bold";

					// return font weight to normal in 1.5 seconds
				var security = this;
				CIDScheduler.ScheduleEvent(
					function() { security.element.all.DayHigh.style.fontWeight = "normal"; },
					1500);
			}

			if (this.dayLow < oldLow) {
				this.element.all.DayLow.style.fontWeight = "bold";

					// return font weight to normal in 1.5 seconds
				var security = this;
				CIDScheduler.ScheduleEvent(
					function() { security.element.all.DayLow.style.fontWeight = "normal"; },
					1500);
			}

				// update day range bar
			var minPrice = Math.min(this.dayLow, this.previousClose);
			var maxPrice = Math.max(this.dayHigh, this.previousClose);

				// make sure we're not dividing by 0
			var totalRange = Math.max((maxPrice - minPrice), .00001);

			this.element.all.BelowCloseBar.style.pixelWidth = 
					Math.max(0, 
					((Math.min(this.dayHigh, this.previousClose) - this.dayLow) / totalRange) * this.kDayRangeBarWidth);
			this.element.all.AboveCloseBar.style.pixelWidth = 
					Math.max(0,
					((this.dayHigh - Math.max(this.dayLow, this.previousClose)) / totalRange) * this.kDayRangeBarWidth);

			this.element.all.AboveCloseBar.style.left = 
					Math.min(this.kDayRangeBarWidth, 
					((Math.max(this.dayLow, this.previousClose) - minPrice) / totalRange) * this.kDayRangeBarWidth);
			this.element.all.CloseMarker.style.left = 
					Math.min(this.kDayRangeBarWidth, 
					((this.previousClose - minPrice) / totalRange) * this.kDayRangeBarWidth);

			this.element.all.OpenMarker.style.left = 
					Math.min(this.kDayRangeBarWidth, 
					((this.open - minPrice) / totalRange) * this.kDayRangeBarWidth);
			this.element.all.LastMarker.style.left = 
					Math.min(this.kDayRangeBarWidth, 
					((this.last - minPrice) / totalRange) * this.kDayRangeBarWidth);

				// update 52-week high and low
			this.element.all.YearHigh.innerText = CIDUtil.FormatNumber(this.yearHigh, 2, true);
			this.element.all.YearLow.innerText = CIDUtil.FormatNumber(this.yearLow, 2, true);

			if (this.yearHigh > oldYearHigh && oldYearHigh > 0) {
				this.element.all.YearHigh.style.fontWeight = "bold";
				this.element.all.YearHigh.style.color = this.kColor_Positive;

					// return font weight to normal in 60 seconds
				var security = this;
				CIDScheduler.ScheduleEvent(
					function() { 
						security.element.all.YearHigh.style.fontWeight = "normal";
						security.element.all.YearHigh.style.color = "black"; },
					60000);
			}

			if (this.yearLow < oldYearLow && oldYearLow > 0) {
				this.element.all.YearLow.style.fontWeight = "bold";
				this.element.all.YearLow.style.color = this.kColor_Negative;

					// return font weight to normal in 60 seconds
				var security = this;
				CIDScheduler.ScheduleEvent(
					function() { 
						security.element.all.YearLow.style.fontWeight = "normal";
						security.element.all.YearLow.style.color = "black"; },
					60000);
			}

			this.element.all.YearLastMarker.style.left = 
					Math.min(this.kDayRangeBarWidth, 
					((this.last - this.yearLow) / (this.yearHigh - this.yearLow)) * this.kDayRangeBarWidth);
		}
		

		// -------------------------------------------------------------------
		//	SetRowNumber
		// -------------------------------------------------------------------
		CIDSecurity.prototype.SetRowNumber = function(
			inIndex)
		{
			this.index = inIndex;

				// highlight the selected item
			if (this.selected) {
//				this.style.border = "2px solid " + "white"; //this.kBarSelected;
//				this.style.pixelLeft -= 2;
//				this.style.offsetHeight -= 4;
				this.style.backgroundColor = this.kBarSelected;
			} else {
					// change the row's background color according to whether it's
					// odd or even, and matching or non-matching
				this.style.backgroundColor = 
						this["kBar" + (this.matching ? "Matching_" : "NonMatching_") + 
						(this.index % 2)];
			}
		}
		

		// -------------------------------------------------------------------
		//	Click
		// -------------------------------------------------------------------
		CIDSecurity.prototype.Click = function()
		{
			this.resultsArea.SecurityClicked(this);
		}
		

		// -------------------------------------------------------------------
		//	Select
		// -------------------------------------------------------------------
		CIDSecurity.prototype.Select = function()
		{
			this.selected = true;

			if (this.style != null) {
				this.style.backgroundColor = this.kBarSelected;
			}
		}
		

		// -------------------------------------------------------------------
		//	Deselect
		// -------------------------------------------------------------------
		CIDSecurity.prototype.Deselect = function()
		{
			this.selected = false;

			if (this.style != null) {
				this.style.backgroundColor = 
						this["kBar" + (this.matching ? "Matching_" : "NonMatching_") + 
						(this.index % 2)];
			}
		}
		

		// -------------------------------------------------------------------
		//	SetPosition
		// -------------------------------------------------------------------
		CIDSecurity.prototype.SetPosition = function(
			inX,
			inY)
		{
			this.style.pixelLeft = inX;
			this.style.pixelTop = inY;
		}
		

		// -------------------------------------------------------------------
		//	GetPosition
		// -------------------------------------------------------------------
		CIDSecurity.prototype.GetPosition = function()
		{
			return [this.style.pixelLeft, this.style.pixelTop];
		}
		

		// -------------------------------------------------------------------
		//	GetWidth
		// -------------------------------------------------------------------
		CIDSecurity.prototype.GetWidth = function()
		{
			return this.element.offsetWidth;
		}
		

		// -------------------------------------------------------------------
		//	GetHeight
		// -------------------------------------------------------------------
		CIDSecurity.prototype.GetHeight = function()
		{
			return this.element.offsetHeight;
		}
	}


	// -------------------------------------------------------------------
	//	Initialize Instance
	// -------------------------------------------------------------------
	this.resultsArea = inResultsArea;
//	this.window = inWindow;
	this.container = inContainer;

	this.index = 0;
	this.matching = true;
	this.selected = false;
	
	this.element = null;
	this.style = null;
	
	this.symbol = "";
	this.companyName = "";
	this.open = 0;
	this.previousClose = 0;
	this.last = 0;
	this.change = 0;
	this.changePercent = 0;
	this.volume = 0;
	this.averageVolume = 10000000;
	this.volumePercentage = 0;
	this.bid = 0;
	this.ask = 0;
	this.dayHigh = 0;
	this.dayLow = 0;
	this.yearHigh = 0;
	this.yearLow = 0;
	this.vega = 1.0;

	this.priceChangeRange = 6;
	this.volumeChangeRange = 15000;
	this.changeDelayRange = 8000;

		// initialize our attributes to whichever were passed in via the SecurityInfo object
	for (var attribute in inSecurityInfo) {
		this[attribute] = inSecurityInfo[attribute];
	}

	this.id = "Sec" + this.symbol;
	this.last = this.open;
	this.change = this.last - this.previousClose;
	this.bid = this.last - 0.03;
	this.ask = this.last + 0.03;
	this.dayHigh = this.last;
	this.dayLow = this.last;
	this.isIndex = (this.symbol.charAt(0) == "^");

	if (this.companyName == "") {
		this.companyName = this.symbol + " Corp.";
	}

	if (this.selected) {
			// we're selected by default
		this.resultsArea.SecurityClicked(this);
	}

	this.Write(this.container);
}


// ===========================================================================
//	CIDResultsArea
// ===========================================================================
function CIDResultsArea(
	inWindow)
{
	if (!CIDResultsArea.prototype.CreateSecurity) {
		
		// -------------------------------------------------------------------
		//	CreateSecurity
		// -------------------------------------------------------------------
		CIDResultsArea.prototype.CreateSecurity = function(
			inSecurityInfo)
		{
			inSecurityInfo.real = !(typeof(inSecurityInfo.price) == "undefined");

// should add html for this sec now			

			this.securities[this.securities.length] = 
					new CIDSecurity(this, this.resultsAreaDiv, inSecurityInfo);
		}
		

		// -------------------------------------------------------------------
		//	CreateSecurities
		// -------------------------------------------------------------------
		CIDResultsArea.prototype.CreateSecurities = function()
		{
			if (arguments[0].constructor == Array) {
					// an array was passed in as the first argument, so we'll
					// extract the symbols from that array
				arguments = arguments[0];
			}

			for (var i = 0; i < arguments.length; i++) {
				this.securities[this.securities.length] = 
						new CIDSecurity(this, this.resultsAreaDiv, 
							{ symbol: arguments[i], real: true });
			}

			this.SecurityClicked(this.securities[this.securities.length - 1]);
		}


		// -------------------------------------------------------------------
		//	AddSecurity
		// -------------------------------------------------------------------
		CIDResultsArea.prototype.AddSecurity = function(
			inSymbol)
		{
			var symbol = inSymbol.toUpperCase().substr(0, 5);

			var existingSecurity = this.GetSecurityBySymbol(symbol);

			if (existingSecurity) {
					// don't add it again, just select it;
				this.SecurityClicked(existingSecurity);
				existingSecurity.element.scrollIntoView(false);

				return;
			}

// this is a hack, should have separate quote data feed that sends updates to the securities
			if (this.securities[0].real) {
					// check to make sure this is a valid symbol
				this.symbolDataIFrame.src = this.quoteDataURL + symbol;

				var resultsArea = this;
				CIDScheduler.ScheduleEvent(
					function() { resultsArea.VerifySymbol(symbol); },
					3000);
			} else {
				this.CreateSecurity({ symbol: symbol });
				
				var newSecurity = this.securities[this.securities.length - 1];

				this.SecurityClicked(newSecurity);

				newSecurity.UpdatePrice();
			}
		}


		// -------------------------------------------------------------------
		//	RemoveSecurity
		// -------------------------------------------------------------------
		CIDResultsArea.prototype.RemoveSecurity = function(
			inSecurity)
		{
			if (!this.selectedSecurity.real) {
// hack to avoid setting the cookie if we're not using real symbols
//				return;
			}

			if (!inSecurity) {
				inSecurity = this.selectedSecurity;
			} 

			if (this.securities[0].real) {
// hack to avoid setting the cookie if we're not using real symbols
					// remove the symbol and store the new list in the cookie
				ArrayRemoveString(this.symbols, inSecurity.symbol);
				gVelocityData.symbolList = this.symbols;
				gVelocityData.store();
			}

			ArrayRemove(this.securities, inSecurity.index);

				// remove the security's line from the HTML
			this.resultsAreaDiv.removeChild(inSecurity.element);

				// update all the bars, in case removing this security changes
				// the maximums or minimums
			this.UpdateAllBars();

				// reorder the securities now that we've removed one
			this.ArrangeSecurities();

				// select the next security down from the deleted one.  make 
				// sure we're not trying to access beyond the end of the array.
			this.SecurityClicked(this.securities[Math.min(inSecurity.index, this.securities.length - 1)]);
		}


		// -------------------------------------------------------------------
		//	VerifySymbol
		// -------------------------------------------------------------------
		CIDResultsArea.prototype.VerifySymbol = function(
			inSymbol)
		{
			var symbolDataDoc = this.doc.frames("SymbolData").document;

			if (symbolDataDoc.readyState != "complete") {
					// the page hasn't finished downloading yet, so try again in 1 second
				var resultsArea = this;
				CIDScheduler.ScheduleEvent(
					function() { resultsArea.VerifySymbol(inSymbol); },
					1000);

				return;
			}

			this.doc.all.AddSecurityMessage.innerText = "";

			if (!/No such ticker symbol/.test(symbolDataDoc.body.innerText)) {
					// we know it's a valid symbol, so create the security
				this.CreateSecurity({ symbol: inSymbol });
				
				var newSecurity = this.securities[this.securities.length - 1];

				this.SecurityClicked(newSecurity);

				this.symbols[this.symbols.length] = inSymbol;

					// store the new symbol in our cookie
				gVelocityData.symbolList = this.symbols;
				gVelocityData.store();

					// show the new security
				newSecurity.element.scrollIntoView();

					// check the quote data again in 3 seconds
				this.quoteDataIFrame.src = this.quoteDataURL + this.symbols.join("+");
				var resultsArea = this;
				CIDScheduler.ScheduleEvent(
					function() { resultsArea.CheckQuoteData(); },
					2000);
			} else {
				this.doc.all.AddSecurityMessage.innerText = "Symbol '" + inSymbol + "' could not be found.";

				this.lookupWindow = window.open("http://finance.yahoo.com/l?s=" + inSymbol, 
						"SymbolLookup", "width=640,height=480,scrollbars=yes,resizable=yes").focus();

					// hah!  wry designer humor.
//				alert("ERROR #739427: ASSERTION_FAILURE (badSymbol) Line: 2342; Char: 42");
			}
		}


		// -------------------------------------------------------------------
		//	WriteSecurities
		// -------------------------------------------------------------------
		CIDResultsArea.prototype.WriteSecurities = function()
		{
/*
			this.resultsAreaDiv = this.doc.all.ResultsArea;

			this.addSecurityDiv = this.doc.all.AddSecurityLine;
//			this.doc.all.AddButton.oResultsArea = this;
*/
// for some reason, putting the border div in the html makes it not have the right height
			this.resultsAreaDiv.insertAdjacentHTML("BeforeEnd", '<div id="MatchingBorder" ' + 
					'style="position: absolute; left: 0px; top: 0px; ' + 
					'width: ' + (this.resultsAreaDiv.offsetWidth - 16) + 
					'px; height: 2px; z-index: 10000; background-color: rgb(70% 70% 70%)">' + 
 					'<img height="1" width="1" src="resources/images/dot-clear.gif"></div>');

			this.borderLine = this.resultsAreaDiv.all.MatchingBorder;
/*			
			for (var i in this.securities) {
				this.securities[i].Write(this.resultsAreaDiv);
			}
*/

// this assumes we've been called after a security has been added
			if (this.securities[0].real) {
					// start streaming the data
				this.symbols = [];
				for (var i in this.securities) {
					this.symbols[this.symbols.length] = this.securities[i].symbol;
				}

				this.quoteDataIFrame.src = this.quoteDataURL + this.symbols.join("+");

					// parse the quote data in 3 seconds
				var resultsArea = this;
				CIDScheduler.ScheduleEvent(
					function() { resultsArea.CheckQuoteData(); },
					3000);
			} else {
					// now that the elements have been created, we can start
					// updating the prices.  don't allow sorting until we've
					// called UpdatePrice on all the securities.
				this.keepSorted = false;

// should have way to turn off SecurityChanged()

				for (var i in this.securities) {
					this.securities[i].UpdatePrice();

						// initialize each security's matching value
					this.securities[i].matching = (Math.abs(this.securities[i].change) >= this.minChange);
				}

					// now we can sort again
				this.keepSorted = true;
			}
		}
		

		// -------------------------------------------------------------------
		//	GetSecurityIndexByID
		// -------------------------------------------------------------------
		CIDResultsArea.prototype.GetSecurityIndexByID = function(
			inID)
		{
			for (var i in this.securities) {
				if (this.securities[i].id == inID) {
					return i;
				}
			}
			
			return -1;
		}
		

		// -------------------------------------------------------------------
		//	GetSecurityByID
		// -------------------------------------------------------------------
		CIDResultsArea.prototype.GetSecurityByID = function(
			inID)
		{
			for (var i in this.securities) {
				if (this.securities[i].id == inID) {
					return this.securities[i];
				}
			}
			
			return null;
		}
		

		// -------------------------------------------------------------------
		//	GetSecurityBySymbol
		// -------------------------------------------------------------------
		CIDResultsArea.prototype.GetSecurityBySymbol = function(
			inSymbol)
		{
			for (var i in this.securities) {
				if (this.securities[i].symbol == inSymbol) {
					return this.securities[i];
				}
			}

			return null;
		}
		

		// -------------------------------------------------------------------
		//	GetSecurityIndex
		// -------------------------------------------------------------------
		CIDResultsArea.prototype.GetSecurityIndex = function(
			inSecurity)
		{
			for (var index in this.securities) {
				if (this.securities[index] == inSecurity) {
					return index;
				}
			}
			
			return -1;
		}
		

		// -------------------------------------------------------------------
		//	SetMinChange
		// -------------------------------------------------------------------
		CIDResultsArea.prototype.SetMinChange = function(
			inMinChange)
		{
			this.minChange = Math.max(parseFloat(inMinChange), 0);

			var foundFirstNonmatching = false;

			for (var i = 0; i < this.securities.length; i++) {
		 		var security = this.securities[i];

				security.matching = (Math.abs(security.change) >= this.minChange);

					// update the security's row number and color
				security.SetRowNumber(i);

					// position the borderline between matching and nonmatching
				if (foundFirstNonmatching == false && security.matching == false) {
					foundFirstNonmatching = true;
					this.borderLine.style.pixelTop = security.style.pixelTop;
					this.borderLine.style.zIndex = security.style.zIndex + 1;
				}
			}
		}
		

		// -------------------------------------------------------------------
		//	OnMouseMove
		// -------------------------------------------------------------------
		CIDResultsArea.prototype.OnMouseMove = function()
		{
			this.keepSorted = false;
			this.lastMouseMove = new Date().getTime();

			if (!this.mouseTimerStarted) {
					// we don't have a timer started, so remember that we're starting one
				this.mouseTimerStarted = true;

					// in 2 seconds, check if the mouse has moved within the results area
				var resultsArea = this;
				CIDScheduler.ScheduleEvent(
					function() { resultsArea.CheckForMouseMove(); },
					this.mouseMoveThreshold);
			}
		}
		

		// -------------------------------------------------------------------
		//	UpdateAllBars
		// -------------------------------------------------------------------
		CIDResultsArea.prototype.UpdateAllBars = function()
		{
			this.maxChangeNeg = 0;
			this.maxChangePos = 0;
			this.maxVolumePercentage = 0;

			for (var i = 0; i < this.securities.length; i++) {
				if (this.securities[i].isIndex) {
						// ignore market indices
					continue;
				}

				this.maxChangePos = Math.max(this.maxChangePos, this.securities[i].change);
				this.maxChangeNeg = Math.min(this.maxChangeNeg, this.securities[i].change);
				this.maxVolumePercentage = Math.max(this.maxVolumePercentage, this.securities[i].volumePercentage);
			}

			this.changeRange = Math.abs(this.maxChangeNeg) + this.maxChangePos;

			for (var i = 0; i < this.securities.length; i++) {
					// renormalize each change bar according to the longest one
		 		this.securities[i].UpdateChangeBar(this.maxChangeNeg, this.maxChangePos, this.changeRange);

					// renormalize each volume bar according to the longest one
		 		this.securities[i].UpdateVolumeBar(this.maxVolumePercentage);

					// tell the security whether it matches the shuffle
				this.securities[i].matching = (Math.abs(this.securities[i].change) >= this.minChange);
			}			
		}


		// -------------------------------------------------------------------
		//	CheckForMouseMove
		// -------------------------------------------------------------------
		CIDResultsArea.prototype.CheckForMouseMove = function()
		{
			var currentTime = new Date().getTime();

			if ((currentTime - this.lastMouseMove) > this.mouseMoveThreshold) {
					// since the timer event has fired, we want to allow 
					// another one to be started on the next mouse move
				this.mouseTimerStarted = false;

					// the mouse has been outside the results area or inside
					// and not moving for > 2 seconds, so start auto-sorting
					// the results area again
				this.keepSorted = true;
				this.ArrangeSecurities();
			} else { 
					// if the mouse last moved e.g. 500 msecs ago, check if the 
					// mouse has moved again in 1500 msecs, rather than 2000
				var resultsArea = this;
				CIDScheduler.ScheduleEvent(
					function() { resultsArea.CheckForMouseMove(); },
					this.mouseMoveThreshold - (currentTime - this.lastMouseMove));
			}
		}


		// -------------------------------------------------------------------
		//	CheckQuoteData
		// -------------------------------------------------------------------
		CIDResultsArea.prototype.CheckQuoteData = function()
		{
			this.quoteDataDoc = this.doc.frames("QuoteData").document;

			if (this.quoteDataDoc.readyState != "complete") {
					// the page hasn't finished downloading yet, so try again in 2 seconds
//Log("quote data not ready");

				var resultsArea = this;
				CIDScheduler.ScheduleEvent(
					function() { resultsArea.CheckQuoteData(); },
					2000);

				return;
			}

			if (this.quoteDataDoc.all.tags("PRE").length == 0) {
				this.quoteDataIFrame.src = this.quoteDataURL + this.symbols.join("+");

					// parse the quote data in 3 seconds
				var resultsArea = this;
				CIDScheduler.ScheduleEvent(
					function() { resultsArea.CheckQuoteData(); },
					3000);
//alert("No <PRE></PRE> block found.");
				return;
			}

			var quoteBlocks = this.quoteDataDoc.all.tags("PRE");

			for (var i = 0; i < quoteBlocks.length; i++) {
				var securityInfo = eval(quoteBlocks[i].innerText);

				if (securityInfo) {
					var security = this.GetSecurityBySymbol(securityInfo.symbol);

					if (security != null) {
/*
if (securityInfo.symbol == "^IXIC") {
Log(this.quoteDataURL + this.symbols.join("+"));
Log(quoteBlocks[i].innerText);
Log(securityInfo);
//	alert(securityInfo.join(", "));
}
*/
						security.UpdateInfo(securityInfo);
					}
				}
			}

			this.UpdateAllBars();

//			if (this.keepSorted) {
					// now that we've updated the relevant securities, re-sort them
				var compareChange = 
					function(inA, inB)
					{
							// larger numbers should sort before smaller ones, so 
							// return a negative value if A > B
						return Math.abs(inB.change) - Math.abs(inA.change);
					};

					// sort the securities in order of the magnitude of their changes
				this.securities.sort(compareChange);

					// now reorder the securities according to the magnitude 
					// of their change
				this.ArrangeSecurities();
//			}

				// check the quote data again in 3 seconds
			this.quoteDataIFrame.src = this.quoteDataURL + this.symbols.join("+");
			var resultsArea = this;
			CIDScheduler.ScheduleEvent(
				function() { resultsArea.CheckQuoteData(); },
				3000);
		}


		// -------------------------------------------------------------------
		//	ParseQuote
		// -------------------------------------------------------------------
		CIDResultsArea.prototype.ParseQuote = function(
			inQuoteData)
		{
				// we'll fill this object with data and return it
			var securityInfo = { };

			var quoteLines = inQuoteData.split("\n");

			if (/^\s*$/.test(quoteLines[0])) {
					// the first line is blank, so get rid of it
				quoteLines = quoteLines.slice(1);
			}

			if (quoteLines.length == 0) {
				return;
			}

				// the first line is formatted like "YAHOO INC        (NasdaqNM:YHOO) "
			var companyInfo = /^\s*(.*)\(.*:([^)]+)\)/.exec(quoteLines[0]);

if (companyInfo == null || companyInfo[2] == null) {
Log("ERROR: companyInfo\n" + inQuoteData + "\n   quoteLines.length: " + quoteLines.length + "\n\n");

	return null;
}

			securityInfo.companyName = CIDUtil.Trim(companyInfo[1]);
			securityInfo.symbol = companyInfo[2];

// indexes have N/A for almost everything except Last

				// "  4:01PM     172 1/64     +57/64     +0.52%    171 1/8  5,198,000     Feb 11  \n"
				// lastTrade change changePercent previousClose volume
			var tradeLineRE = /^\s*\S+[ :]\S+\s+([\d]+\s?[\d/]*)\s+([-\d+]+\s?[\d/]*)\s+([-\d+.]+)%\s+([\d]+\s?[\d/]*)\s+([\d,]+)/;
			var attributeData = tradeLineRE.exec(quoteLines[2]);
			var attributeNames = ["last", "change", "changePercent", "previousClose", "volume"];

if (attributeData == null) {
//this.doc.all.LogDiv.style.visibility = "visible";
//this.doc.all.Log.value = "ERROR: tradeLine\n" + inQuoteData;
Log("ERROR: tradeLine\n" + inQuoteData);

	return null;
}

			for (var i in attributeNames) {
					// the subcomponent matches start at index 1
				securityInfo[attributeNames[i]] = CIDUtil.Trim(attributeData[parseInt(i) + 1], " ");

				if (/\//.test(securityInfo[attributeNames[i]])) {
						// there's a / in the attribute, so we have to turn 
						// the fraction into a float
					var wholeAndFraction = securityInfo[attributeNames[i]].split(" ");

					if (wholeAndFraction.length > 1) {
							// whole and a fraction, e.g. 178 3/4
						securityInfo[attributeNames[i]] = 
								CIDUtil.RoundDigits(parseInt(wholeAndFraction[0]) + 
								eval(wholeAndFraction[1]), 2);
					} else {
							// no whole number, e.g. -7/8
						securityInfo[attributeNames[i]] = 
								CIDUtil.RoundDigits(eval(wholeAndFraction[0]), 2);
					}
				}
			}

				// "   165 1/4    175 3/8        172    172 1/2   172 3/16  8,248,454     Feb 14 \n"
				// may also return N/A for bid, ask and average volume
				// dayHigh dayLow bid ask open averageVolume
			var rangeLineRE = /^\s*([\d]+\s?[\d/]*)\s+([\d]+\s?[\d/]*)\s+([\dN]+\s?[\d/A]*)\s+([\dN]+\s?[\d/A]*)\s+([\d]+\s?[\d/]*)\s+([\d,N/A]+)/;
			var attributeData = rangeLineRE.exec(quoteLines[4]);
			var attributeNames = ["dayLow", "dayHigh", "bid", "ask", "open", "averageVolume"];

if (attributeData == null) {
Log("ERROR: rangeLine\n" + inQuoteData);

	return null;
}

			for (var i in attributeNames) {
					// the subcomponent matches start at index 1
				securityInfo[attributeNames[i]] = CIDUtil.Trim(attributeData[parseInt(i) + 1], " ");

				if (securityInfo[attributeNames[i]] != "N/A" && /\//.test(securityInfo[attributeNames[i]])) {
						// there's a / in the attribute, so we have to turn 
						// the fraction into a float
					var wholeAndFraction = securityInfo[attributeNames[i]].split(" ");

					if (wholeAndFraction.length > 1) {
							// whole and a fraction, e.g. 178 3/4
						securityInfo[attributeNames[i]] = 
								CIDUtil.RoundDigits(parseInt(wholeAndFraction[0]) + 
								eval(wholeAndFraction[1]), 2);
					} else {
							// no whole number, e.g. -7/8
						securityInfo[attributeNames[i]] = 
								CIDUtil.RoundDigits(eval(wholeAndFraction[0]), 2);
					}
				}
			}

			return securityInfo;
		}


		// -------------------------------------------------------------------
		//	UpdateChart
		// -------------------------------------------------------------------
		CIDResultsArea.prototype.UpdateChart = function()
		{
			if (this.securities[0].real) {
				this.chart.src = "http://ichart.yahoo.com/t?s=" + this.selectedSecurity.symbol;

				var resultsArea = this;
				CIDScheduler.ScheduleEvent(
					function() { resultsArea.UpdateChart(); },
					45000);
			}
		}
		

		// -------------------------------------------------------------------
		//	SelectNextSecurity
		// -------------------------------------------------------------------
		CIDResultsArea.prototype.SelectNextSecurity = function()
		{
			var currentIndex = 0;

			if (this.selectedSecurity != null) {
				currentIndex = this.selectedSecurity.index;
				this.selectedSecurity.Deselect();
			}

			this.selectedSecurity = this.securities[(currentIndex + 1) % this.securities.length];
			this.selectedSecurity.Select();
			this.selectedSecurity.element.scrollIntoView(false);

			this.UpdateChart();
		}
		

		// -------------------------------------------------------------------
		//	SelectPreviousSecurity
		// -------------------------------------------------------------------
		CIDResultsArea.prototype.SelectPreviousSecurity = function()
		{
			var currentIndex = 0;

			if (this.selectedSecurity != null) {
				currentIndex = this.selectedSecurity.index;
				this.selectedSecurity.Deselect();
			}

			this.selectedSecurity = this.securities[(this.securities.length +	currentIndex - 1) % this.securities.length];
			this.selectedSecurity.Select();
			this.selectedSecurity.element.scrollIntoView(false);

			this.UpdateChart();
		}

		
		// -------------------------------------------------------------------
		//	SecurityClicked
		// -------------------------------------------------------------------
		CIDResultsArea.prototype.SecurityClicked = function(
			inSecurity)
		{
			if (this.selectedSecurity != null) {
				this.selectedSecurity.Deselect();
			}

			if (inSecurity != this.selectedSecurity) {
					// we've changed securities, so we should hide the chart
					// until the new one is downloaded
// the chart sometimes gets stuck in a hidden state for some reason
//				this.chart.style.visibility = "hidden";				
			}

			this.selectedSecurity = inSecurity;
			this.selectedSecurity.Select();

			this.UpdateChart();
		}
		

		// -------------------------------------------------------------------
		//	SecurityChanged
		// -------------------------------------------------------------------
		CIDResultsArea.prototype.SecurityChanged = function(
			inChangedSecurity,
			inMetaState)
		{
			var newChange = inChangedSecurity.change;

				// tell the changed security whether it matches the shuffle
			inChangedSecurity.matching = (Math.abs(newChange) >= this.minChange);

				// decide whether we need to update all the change bars
			var updateChangeBar = false;

			if ((newChange > this.maxChangePos) || 
					(inChangedSecurity == this.maxChangeSecurityPos)) {
					// remember that this security has the largest positive change
				this.maxChangeSecurityPos = inChangedSecurity;
				this.maxChangePos = newChange;
				updateChangeBar = true;
			} else if ((newChange < this.maxChangeNeg) || 
					(inChangedSecurity == this.maxChangeSecurityNeg)) {
					// remember that this security has the largest negative change
				this.maxChangeSecurityNeg = inChangedSecurity;
				this.maxChangeNeg = newChange;
				updateChangeBar = true;
			} else {
					// this doesn't change the max, but we have to make
					// sure the changed security's bar is updated
				inChangedSecurity.UpdateChangeBar(this.maxChangeNeg, this.maxChangePos, this.changeRange);
			}

				// calc the total change range
			this.changeRange = Math.abs(this.maxChangeNeg) + this.maxChangePos;

				// decide whether we need to update all the volume bars
			var updateVolumeBar = false;

			if (inChangedSecurity.volumePercentage > this.maxVolumePercentage) {
				this.maxVolumePercentage = inChangedSecurity.volumePercentage;
				updateVolumeBar = true;
			} else {
					// this doesn't change the max, but we have to make
					// sure the changed security's bar is updated
				inChangedSecurity.UpdateVolumeBar(this.maxVolumePercentage);
			}

			if (updateChangeBar || updateVolumeBar) {
				for (var i = 0; i < this.securities.length; i++) {
					if (updateChangeBar) {
							// renormalize each change bar according to the longest one
						this.securities[i].UpdateChangeBar(this.maxChangeNeg, this.maxChangePos, this.changeRange);
					}

					if (updateVolumeBar) {
						this.securities[i].UpdateVolumeBar(this.maxVolumePercentage);
					}
				}			
			}
			
			if (this.keepSorted) {
				var compareChange = 
					function(inA, inB)
					{
							// larger numbers should sort before smaller ones
						return Math.abs(inB.change) - Math.abs(inA.change);
					};

					// sort the securities in order of the magnitude of their changes
				this.securities.sort(compareChange);

					// now reorder the securities according to the magnitude 
					// of their change
				this.ArrangeSecurities();
			}
		}
		

		// -------------------------------------------------------------------
		//	ArrangeSecurities
		// -------------------------------------------------------------------
		CIDResultsArea.prototype.ArrangeSecurities = function()
		{
				// save the current scroll offset, so we can restore it later
			var oldScrollTop = this.resultsAreaDiv.scrollTop;

			var y = this.matchingHomeY;
			var foundFirstNonmatching = false;

			for (var i = 0; i < this.securities.length; i++) {
		 		var security = this.securities[i];

				security.SetPosition(this.matchingHomeX, y);

				y += security.GetHeight() + this.securityOffset;

					// update the security's row number and color
				security.SetRowNumber(i);

					// position the borderline between matching and nonmatching
				if (foundFirstNonmatching == false && security.matching == false) {
					foundFirstNonmatching = true;
					this.borderLine.style.pixelTop = security.style.pixelTop;

// this should position the line under the column lines, but it doesn't

					this.borderLine.style.zIndex = security.style.zIndex + 1;
				}

/*
// security always points to the last one in the list, not the one it pointed to 
// when the function is created
				var resultsArea = this;
				var id = security.id;
				CIDScheduler.ScheduleEvent(
					function() { resultsArea.GetSecurityByID(id).UpdatePrice(); }, Math.random() * 8000 + 10000);
*/				
//				CIDScheduler.ScheduleEvent(
//					function() { security.UpdatePrice(); }, Math.random() * 8000 + 10000);
			}

			this.addSecurityDiv.style.pixelTop = y;

				// restore the old scroll offset, since arranging the 
				// securities can cause the scrollbar to move
			this.resultsAreaDiv.scrollTop = oldScrollTop;
		}
	}
	

	// -------------------------------------------------------------------
	//	Initialize Instance
	// -------------------------------------------------------------------
	this.window = inWindow;
	this.doc = this.window.document;

	this.resultsAreaDiv = this.doc.all.ResultsArea;
	this.addSecurityDiv = this.doc.all.AddSecurityLine;
	this.borderLine = this.doc.all.MatchingBorder;
	this.chart = this.doc.all.DetailerSummaryChart;

	this.symbolDataIFrame = this.doc.all.SymbolData;
	this.quoteDataIFrame = this.doc.all.QuoteData;
	this.quoteDataDoc = null;

		// we have to use the actual host name here.  otherwise, IE will 
		// complain about cross-frame security access.  getting to the page
		// from johndunning.com is different than www.johndunning.com.
	this.quoteDataURL = "http://" + this.doc.location.host + "/portfolio/brokerage-prototype/resources/quotes.php?";

	this.symbols = [];
	this.selectedSecurity = null;

	this.securities = new Array();

	this.keepSorted = true;
	this.mouseTimerStarted = false;
	this.lastMouseMove = 0;
	this.mouseMoveThreshold = 2000;
	
	this.matchingHomeX = 0;
	this.matchingHomeY = 0;
//	this.matchingHomeX = 10;
//	this.matchingHomeY = 163;
	this.nonmatchingHomeX = 10;
	this.nonmatchingHomeY = 10;

	this.minChange = 1;
	this.maxChange = 0;
	this.maxChangeNeg = 0;
	this.maxChangePos = 0;
	this.changeRange = 1;
	this.maxChangeSecurity = null;
	this.maxChangeSecurityNeg = null;
	this.maxChangeSecurityPos = null;
	this.maxVolumePercentage = 1;

 	this.securityOffset = ((navigator.userAgent.indexOf("Mac") != -1) ? 24 : 0);
}

