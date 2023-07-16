// ===========================================================================
//	CIDUtilities.js
// ===========================================================================

/*
function arrayRemove(i) {
    for (i; i < this.length-1; i++) {
        this[i] = this[i] + 1;
    }
    this.length--;    
}

Array.prototype.remove = arrayRemove;
 
alert(Array.remove);
*/

function ArrayRemove(
	inArray,
	inIndex) 
{
	if (typeof(inIndex) == "string") {
			// make sure we have an integer index
		inIndex = parseInt(inIndex);
	}

	for (var i = inIndex; i < inArray.length - 1; i++) {
		inArray[i] = inArray[i + 1];
	}

    inArray.length--;    
}


function ArrayRemoveString(
	inArray,
	inString,
	inRemoveAllInstances) 
{
	if (inRemoveAllInstances) {
			// to remove all instances of this string, go backwards in the
			// array so the indexes don't get messed up
		for (var i = inArray.length - 1; i >= 0; i--) {
			if (inArray[i] == inString) {
				ArrayRemove(inArray, i);
			}
		}
	} else {
		for (var i = 0; i < inArray.length; i++) {
			if (inArray[i] == inString) {
				ArrayRemove(inArray, i);

					// we want to remove just the first instance, so bail now
				return;
			}
		}
	}
}


// ===========================================================================
//	CIDUtil
// ===========================================================================
var CIDUtil = {

	// -------------------------------------------------------------------
	//	FormatNumber
	// -------------------------------------------------------------------
	FormatNumber: function(
		inNumber,
		inDecimalDigits,
		inSeparateThousands)
	{
			// don't allow any negative numbers for inDecimalDigits
		inDecimalDigits = (inDecimalDigits < 0) ? 0 : inDecimalDigits;
		
		var roundedNumber = CIDUtil.RoundDigits(inNumber, inDecimalDigits);

		var numString = roundedNumber.toString();
		var decimalPoint = numString.indexOf(".");
		
		if (decimalPoint == -1) {
				// the number doesn't have a decimal point, so add one and 
				// update decimalPoint
			decimalPoint = numString.length;
			numString += ".";
		}

			// break the string into 2 integers,
			// one for the whole part, one for the fractional
		var wholeString = numString.substr(0, decimalPoint);
		var sign = wholeString.match(/[-+]/);
		sign = (sign == null) ? "" : sign[0];
		wholeString = wholeString.match(/\d+/)[0];
		var fractionalString = numString.substr(decimalPoint + 1);

		if (inSeparateThousands) {
			var withoutCommas = wholeString;
			var withCommas = "";

			while ((withoutCommas.length - 1) / 3 >= 1){
				withCommas = "," + withoutCommas.substr(withoutCommas.length - 3) + 
						withCommas;
				withoutCommas = withoutCommas.slice(0, -3);
			}

				// put the remaining digits at the front of the number
			wholeString = withoutCommas + withCommas;
//			numString = wholeString + "." + fractionalString;
		}

		if (inDecimalDigits == 0) {
				// don't need to pad the number with any zeros
			numString = sign + wholeString;
		} else {
//			decimalDigitCount = numString.length - decimalPoint - 1;

				// pad number with extra zeros, if necessary
//			while (decimalDigitCount < inDecimalDigits) {
			while (fractionalString.length < inDecimalDigits) {
				fractionalString += "0";
//				decimalDigitCount++;
			}

			numString = sign + wholeString + "." + fractionalString;
		}

		return numString;
	},


	// -------------------------------------------------------------------
	//	RoundDigits
	// -------------------------------------------------------------------
	RoundDigits: function(
		inNumber,
		inAccuracy)
	{
			// don't allow a negative accuracy
		inAccuracy = (inAccuracy < 0) ? 0 : inAccuracy;

		return Math.round(inNumber * Math.pow(10, inAccuracy)) / Math.pow(10, inAccuracy);
	},


	// -------------------------------------------------------------------
	//	Trim
	// -------------------------------------------------------------------
	// doesn't work with \, ^, or -
	Trim: function(
		inString,
		inTrimCharacters)
	{
		return inString.replace(new RegExp("[" + inTrimCharacters + "]+$"), "");
	}
};


// ===========================================================================
//	CIDScheduler
// ===========================================================================
// 
// add a way to turn events on and off
// optionally store up fired events while scheduler is off, then fire them all
// when it turns back on

var CIDScheduler = {
	events: [],
	eventNumber: 0,
	

	// -------------------------------------------------------------------
	//	ScheduleEvent
	// -------------------------------------------------------------------
	ScheduleEvent: function(
		inFunction,
		inDelay)
	{
		this.events[this.eventNumber] = inFunction;

		setTimeout('CIDScheduler.ExecuteEvent(' + this.eventNumber + ')',
				inDelay);
				
		this.eventNumber++;
	},
	

	// -------------------------------------------------------------------
	//	ExecuteEvent
	// -------------------------------------------------------------------
	ExecuteEvent: function(
		inEventNumber)
	{
		this.events[inEventNumber]();
		this.events[inEventNumber] = null;
	}
};



/*

function round(objValue, decPlaces)
{
  // construct round value:
  var plusPoint5 = new String(".");
  for (var j = 0; j < decPlaces; j++){
    plusPoint5 += "0";
  }
  plusPoint5 += "5";
  // For two places, we now have .005.
 
  var localStr = new String(objValue + parseFloat(plusPoint5));
  // Now search for the '.', trucate and return.
  decPos = localStr.indexOf(".");
  localStr = localStr.substring(0, decPos+decPlaces);
  return localStr;
}


 function format(num, places) {
div1.innerText=3Dnum;
var rounder=3DMath.pow(10, places);
var final=3D(Math.floor(num*rounder))/rounder;
div2.innerText=3Dfinal;
}

function GetLog(x)
{
if (x==0) return(1);
return(Math.floor(Math.log(Math.abs(x))/Math.LN10));
}
 
function DigRound (x, dig)
{
var coeff = Math.pow(10,-(GetLog(x)-dig+1));
return (Math.round(x*coeff)/coeff);
}
 


  // Round the decimal place to a maximum of two digits.
 
  var FixedDecimalsA1 = (FixDecimalsA1 * 100);
  var FixedDecimalsA2 = Math.round(FixedDecimalsA1);
  var FixedDecimalsA3 = (FixedDecimalsA2 / 100);
  var FixedDecimalsB1 = (FixDecimalsB1 * 100);
  var FixedDecimalsB2 = Math.round(FixedDecimalsB1);
  var FixedDecimalsB3 = (FixedDecimalsB2 / 100);
 
  // If the number of decimal places in the dollar amounts is only 1 then add a zero to it to
  // make it a conventional dollar amount.
 
  var strFixedDecimalsA3 = FixedDecimalsA3.toString();
  var FixedDecimalsA3Test = strFixedDecimalsA3.indexOf('.');
 
  if (FixedDecimalsA3Test != "-1") {
 
      if (strFixedDecimalsA3.length != FixedDecimalsA3Test + 3) {         FixedDecimalsA3 = FixedDecimalsA3 + "0";
      }
 
  }
 
  var strFixedDecimalsB3 = FixedDecimalsB3.toString();
  var FixedDecimalsB3Test = strFixedDecimalsB3.indexOf('.');
 
  if (FixedDecimalsB3Test != "-1") {
 
      if (strFixedDecimalsB3.length != FixedDecimalsB3Test + 3) {         FixedDecimalsB3 = FixedDecimalsB3 + "0";
      }
 
  }
 
  // Plug in the amounts in the appropriate fields.
 
  document.GetInfo.Life_Amount2.value = FixedDecimalsA3;
  document.GetInfo.Life_Cost.value = FixedDecimalsB3;
 
}
 


function formatNumber(number,width,accuracy,rounded,padded) {
// number is the number to be operated on,  it must be in standard format, //      not scientific notation
// width is the output width, which must be greater than 0
// accuracy is the digits to the right of the decimal
// rounded is a boolean whether to round the number or not
// padded is a boolean whether to pad the number on the left with blanks //
//  Examples:
//    myNewValue = formatNumber(121.355,9,2,false,true); 
//    myNewValue contains "  121.35"
//    myNewValue = formatNumber(121.355,9,2,true,true);
//    myNewValue contains "  121.36"
//    myNewValue = formatNumber(121.355,9,2,true,false);
//    myNewValue contains "121.36"
//    myNewValue = formatNumber(.355,4,2,true,true);
//    myNewValue contains "0.36"
 
var myNum, errorString, leftDigits, leftPadLength, leftWidth;
var roundingAddend, zeroString;
var decimalFound, searchString, i;
myNum = number;
// handle bad parameters
if (isNaN(width)){
return '*';
}
if (width < 1) {
return '*';
}
if (isNaN(accuracy)){
return '*';
}
if (accuracy < 0) {
return '*';
}
 
if (isNaN(myNum)){
return '*';
}
// handle oversized values
errorString = '********************';
leftDigits = 1 + Math.floor(Math.log(myNum) / Math.LN10);
if (leftDigits < 1) {
leftDigits = 1; }
if (myNum < 0) {
leftDigits += 1;
} 
if (accuracy > 0) {
leftWidth = width - accuracy - 1;
}
else
{
leftWidth = width;
}
if (leftDigits > leftWidth) {
return errorString.substring(0,width);
}
// do rounding
if(rounded) {
roundingAddend = Math.pow(10,( - accuracy)) * .5;
myNum = parseFloat(myNum) + roundingAddend;
}
// pad the number
if(padded) {
leftPadLength = leftWidth - leftDigits;
if (leftPadLength > 0) {
  for (i=1;i<=leftPadLength;i++)
  {
  myNum = " " + myNum;
  }
  }
}
// see if there is a decimal point
searchString = " " + myNum;
decimalFound = searchString.indexOf(".");
if(decimalFound < 0) {
zeroString = ".";
}
else
{
zeroString = "";
}
// add a string of zeroes
for(i=1;i<=width;i++) {
zeroString += "0";
}
myNum += zeroString;
// now make the trimmed number
if(accuracy > 0) {
return myNum.substring(0,myNum.indexOf(".") + accuracy + 1); }
else
{
return myNum.substring(0,width);
}
}



 
function formatDecimal(amount){
var tmpString = new String(amount);
if(tmpString.indexOf(".") == -1){
  tmpString = tmpString + ".00";
} else {
  var startDec = tmpString.indexOf(".");
  var strBegin = tmpString.substring(0, startDec);
  var strEnd = tmpString.substring(startDec, tmpString.length);
  if(strEnd.length >= 4){
  var strEnd = strEnd.substring(0,4);
  var endVal = strEnd.charAt(strEnd.length - 1);
  if(endVal >= 5){
    endVal = ".00" + endVal;
    strEnd = Number(strEnd) + (.01 - endVal);
  } else {
    strEnd = strEnd.substring(0,3);
  }
  }
  if(strEnd.length < 3){
  tmpString = strBegin + strEnd + "0";
  } else {
  tmpString = strBegin + strEnd;
  }
}
return tmpString;
}
 

*/