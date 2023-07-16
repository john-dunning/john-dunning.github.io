// ===========================================================================
//  CIDInitialize.js
// ===========================================================================


// ===========================================================================


//alert("in CIDInitialize.js");

//window.onload = Initialize;

//function window.onload()
function Initialize()
{
	gLastMouseOver = null;

	gStatusBar = new CIDStatusBar(window);

	//alert("about to create markers");

	gStatusBar.CreateMarker("XYZ700", 
			{ action: "B", quantity: 700, symbol: "XYZ", lastFillPrice: 69.15 });
	gStatusBar.CreateMarker("ABC1000", 
			{ action: "S", quantity: 1000, symbol: "ABC", lastFillPrice: 23.25 });
	gStatusBar.CreateMarker("PDQR1400", 
			{ action: "B", quantity: 1400, symbol: "PDQR", pricing: "LIM", limitPrice: 47.25 });
	gStatusBar.CreateMarker("GHO600", 
			{ action: "B", quantity: 600, symbol: "GHO", timing: "GTC", filled: 200, lastFillPrice: 63.75 });
	gStatusBar.CreateMarker("WTI1600", 
			{ action: "S", quantity: 1600, symbol: "WTI", pricing: "LIM", limitPrice: 78.25 });
	gStatusBar.CreateMarker("LMNO900", 
			{ action: "S", quantity: 900, symbol: "LMNO", timing: "GTC", lastFillPrice: 28.70 });


	gResultsArea = new CIDResultsArea(window);

		// make a long-lived cookie accessible from anywhere on my site
//	gVelocityData = new Cookie(document, "VelocityData", 400000, "/", "johndunning.com");
	gVelocityData = new Cookie(document, "VelocityData", 400000);

	var currentTime = new Date();
	var currentTimeString = currentTime.getHours().toString() + currentTime.getMinutes().toString();


	if (true || location.search == "?real" || (location.search != "?fake" && /johndunning/.test(location.hostname) && 
//	if (location.search == "?real" || (location.search != "?fake" && /johndunning/.test(location.hostname) && 
			(currentTimeString > "0929" && currentTimeString < "1425"))) { 
		if (gVelocityData.load()) {
				// a cookie of Velocity data exists and was loaded, so create
				// the symbols from the stored list

			gResultsArea.CreateSecurities(gVelocityData.symbolList);
		} else {
				// we haven't stored a cookie on this machine yet, so make one,
				// then create the symbols from it
			gVelocityData.symbolList = [
					"YHOO", "DELL", "CSCO", "EBAY", "MSFT", "SAP", "SNE", // "CPQ", 
					"IBM", "AAPL", "SUNW", "ORCL", "SCH", "GE", "INTU", "MRK",
					"T", "QQQ", "INTC"
			];

			gVelocityData.store();

			gResultsArea.CreateSecurities(gVelocityData.symbolList);
		}
	} else { 
		gResultsArea.CreateSecurity(
				{ symbol: "FGH", open: 38.55, previousClose: 48.30, volume: 892023, vega: 1.2, averageVolume: 2327899 });

		gResultsArea.CreateSecurity(
				{ symbol: "UVWX", open: 87.90, previousClose: 91.10, volume: 621467, averageVolume: 7327899 });
		gResultsArea.CreateSecurity(
				{ symbol: "DEFG", open: 52.75, previousClose: 50, volume: 7913584, averageVolume: 12327899 });
		gResultsArea.CreateSecurity(
				{ symbol: "QRST", open: 93.25, previousClose: 91.05, volume: 9310004, averageVolume: 17432899 });
		gResultsArea.CreateSecurity(
				{ symbol: "XYZ", open: 69.15, previousClose: 67.75, volume: 12532029, companyName: "XYZ Corp.", vega: 1.5, selected: true, averageVolume: 22327899 });
		gResultsArea.CreateSecurity(
				{ symbol: "STUVW", open: 89.55, previousClose: 85.30, volume: 4538209, averageVolume: 10657899 });
		gResultsArea.CreateSecurity(
				{ symbol: "TUVW", open: 32.20, previousClose: 33.70, volume: 556937, vega: .5, averageVolume: 1232789 });
		gResultsArea.CreateSecurity(
				{ symbol: "LMNO", open: 28.70, previousClose: 27.55, volume: 3211856, averageVolume: 5327899 });
		gResultsArea.CreateSecurity(
				{ symbol: "ABC", open: 23.25, previousClose: 24.15, volume: 8232894, companyName: "A Big Corporation, Inc.", vega: 2, averageVolume: 6920899 });
		gResultsArea.CreateSecurity(
				{ symbol: "PQR", open: 39.25, previousClose: 38.55, volume: 4123321, averageVolume: 8327899 });
		gResultsArea.CreateSecurity(
				{ symbol: "GHO", open: 63.75, previousClose: 63.35, volume: 5289953, companyName: "Giant Hotels Organization, Inc.", vega: .75, averageVolume: 6327899 });
		gResultsArea.CreateSecurity(
				{ symbol: "PDQ", open: 23.30, previousClose: 22.90, volume: 874990, vega: 1.1, averageVolume: 1232899 });
		gResultsArea.CreateSecurity(
				{ symbol: "JK", open: 23.55, previousClose: 23.80, volume: 538209, averageVolume: 5232789 });
		gResultsArea.CreateSecurity(
				{ symbol: "EFGHI", open: 43.55, previousClose: 43.80, volume: 1538209, averageVolume: 3278998 });

	}


	// alert("about to write stuff");
	gStatusBar.WriteMarkers();
	gStatusBar.ArrangeMarkers();

	setTimeout('gStatusBar.GetMarkerByID("XYZ700").UpdateFilled()', 5600);
	setTimeout('gStatusBar.GetMarkerByID("ABC1000").UpdateFilled()', 8400);
	setTimeout('gStatusBar.GetMarkerByID("PDQR1400").UpdateFilled()', 3000);
	setTimeout('gStatusBar.GetMarkerByID("GHO600").UpdateFilled()', 4500);
	setTimeout('gStatusBar.GetMarkerByID("WTI1600").UpdateFilled()', 7000);
	setTimeout('gStatusBar.GetMarkerByID("LMNO900").UpdateFilled()', 1500);

	gResultsArea.WriteSecurities();
	gResultsArea.ArrangeSecurities();

		// set up automatic attribute updates, based on selected security
	document.all.DetailerSummarySymbol.setExpression("innerText", 
		"(gResultsArea.selectedSecurity != null) ? gResultsArea.selectedSecurity.symbol : ''");

	document.all.DetailerSummaryPrice.setExpression("innerText", 
		"(gResultsArea.selectedSecurity != null) ? CIDUtil.FormatNumber(gResultsArea.selectedSecurity.last, 2, true) : ''");

	document.all.DetailerSummaryPrice.style.setExpression("color", 
		"(gResultsArea.selectedSecurity != null) ? gResultsArea.selectedSecurity.element.all.Change.style.color : ''");

	document.all.DetailerSummaryName.setExpression("innerText", 
		"(gResultsArea.selectedSecurity != null) ? gResultsArea.selectedSecurity.companyName : ''");

	document.all.DetailerNewOrderLabel.setExpression("innerText", 
		"(gResultsArea.selectedSecurity != null) ? 'New ' + gResultsArea.selectedSecurity.symbol + ' Order' : ''");

	document.all.ResultsArea.style.setExpression("width", "document.body.clientWidth - 16");

//	document.all.DetailerSummaryChart.setExpression("src", 
//		"'http://ichart.yahoo.com/t?s=' + ((gResultsArea.selectedSecurity != null) ? gResultsArea.selectedSecurity.symbol : 'qqq')");
}
