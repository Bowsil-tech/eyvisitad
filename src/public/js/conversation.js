// The ConversationPanel module is designed to handle
// all display and behaviors of the conversation column of the app.
/* eslint no-unused-vars: "off" */
/* global Api: true, Common: true*/

var ConversationPanel = (function () {
  var settings = {
    selectors: {
      chatBox: '#scrollingChat',
      fromUser: '.from-user',
      fromWatson: '.from-watson',
      latest: '.latest'
    },
    authorTypes: {
      user: 'user',
      watson: 'watson'
    }


  };
  var stream = null;
  // Publicly accessible methods defined
  return {
    init: init,
    inputKeyDown: inputKeyDown,
    togglePanelA: togglePanelA,
    togglePanelB: togglePanelB,
    togglePanelC: togglePanelC,
    togglePanelD: togglePanelD,
    togglePanelF: togglePanelF

  };




  // Initialize the module
  function init() {
    chatUpdateSetup();
    Api.sendRequest('', null);
    setupInputBox();


  }


  // Toggle panel between being:
  // reduced width (default for large resolution apps)
  // hidden (default for small/mobile resolution apps)
  // full width (regardless of screen size)
  function togglePanelA(event, element) {

    console.log(element.value);
    console.log(executionID);

    SelectFlight(executionID, element.value);
    scrollToChatBottomText();
  }
  function togglePanelF(event, element) {

    console.log(element.value);
    console.log(executionID);

    //record();
  }

  function togglePanelB(event, element) {

    Submitpax(element);

  }




  function togglePanelC(event, element) {
    SubmitPayment(element);
  }


  function togglePanelD(event, element) {
    SubmitPaymentTOSabre(element);
  }



  function chatUpdateSetup() {

    // GenereateTable();
    var currentRequestPayloadSetter = Api.setRequestPayload;
    Api.setRequestPayload = function (newPayloadStr) {
      currentRequestPayloadSetter.call(Api, newPayloadStr);
      displayMessage(JSON.parse(newPayloadStr), settings.authorTypes.user);
    };

    var currentResponsePayloadSetter = Api.setResponsePayload;
    Api.setResponsePayload = function (newPayloadStr) {
      currentResponsePayloadSetter.call(Api, newPayloadStr);
      displayMessage(JSON.parse(newPayloadStr), settings.authorTypes.watson);
    };
  }

  // Set up the input box to underline text as it is typed
  // This is done by creating a hidden dummy version of the input box that
  // is used to determine what the width of the input text should be.
  // This value is then used to set the new width of the visible input box.
  function setupInputBox() {
    var input = document.getElementById('textInput');
    var dummy = document.getElementById('textInputDummy');
    var minFontSize = 14;
    var maxFontSize = 16;
    var minPadding = 4;
    var maxPadding = 6;
    var dummyJson;
    // If no dummy input box exists, create one
    if (dummy === null) {
      dummyJson = {
        'tagName': 'div',
        'attributes': [{
          'name': 'id',
          'value': 'textInputDummy'
        }]
      };

      //    dummy = Common.buildDomElement(dummyJson);
      // document.body.appendChild(dummy);
    }

    function adjustInput() {
      if (input.value === '') {
        // If the input box is empty, remove the underline
        input.classList.remove('underline');
        input.setAttribute('style', 'width:' + '100%');
        input.style.width = '100%';
      } else {
        // otherwise, adjust the dummy text to match, and then set the width of
        // the visible input box to match it (thus extending the underline)
        input.classList.add('underline');
        var txtNode = document.createTextNode(input.value);
        ['font-size', 'font-style', 'font-weight', 'font-family', 'line-height',
          'text-transform', 'letter-spacing'].forEach(function (index) {
            dummy.style[index] = window.getComputedStyle(input, null).getPropertyValue(index);
          });
        dummy.textContent = txtNode.textContent;

        var padding = 0;
        var htmlElem = document.getElementsByTagName('html')[0];
        var currentFontSize = parseInt(window.getComputedStyle(htmlElem, null).getPropertyValue('font-size'), 10);
        if (currentFontSize) {
          padding = Math.floor((currentFontSize - minFontSize) / (maxFontSize - minFontSize)
            * (maxPadding - minPadding) + minPadding);
        } else {
          padding = maxPadding;
        }

        var widthValue = (dummy.offsetWidth + padding) + 'px';
        input.setAttribute('style', 'width:' + widthValue);
        input.style.width = widthValue;
      }
    }

    // Any time the input changes, or the window resizes, adjust the size of the input box
    input.addEventListener('input', adjustInput);
    window.addEventListener('resize', adjustInput);

    // Trigger the input event once to set up the input box and dummy element
    Common.fireEvent(input, 'input');
  }



  function GetOnD(fromcity, tocity) {


    var file = '/js/airports.json'
    jsonfile.readFile(file, function (err, obj) {
      console.dir(obj)
    })

    var lang = {};
    var actual_JSON;
    loadJSON(function (response) {
      // Parse JSON string into object
      actual_JSON = JSON.parse(response);
      // console.log(actual_JSON);

      frmFlight = findAirport(actual_JSON, fromcity)
      toFlgiht = findAirport(actual_JSON, tocity);
      // lang[0]= (frmFlight);
      // lang[1]= (toFlgiht);
      lang["f1"] = frmFlight;
      lang["f2"] = toFlgiht;




    });




    return frmFlight;


  }

  var executionID = "";
  function myFunction(fromcity, tocity, datetravel) {
    document.getElementById('load').style.visibility = "visible";

    setTimeout(function () {
      document.getElementById('interactive');
      document.getElementById('load').style.visibility = "hidden";
    }, 1000);
    console.log(fromcity);

    var data = JSON.stringify({
      "cabinClass": "Economy",
      "awardBooking": false,
      "searchType": "BRANDED",
      "promoCodes": [
        "ETIHADF1"
      ],
      "itineraryParts": [
        {
          "from": {
            "code": fromcity,
            "useNearbyLocations": false
          },
          "to": {
            "code": tocity,
            "useNearbyLocations": false
          },
          "when": {
            "date": datetravel
          }
        }
      ],
      "passengers": {
        "ADT": "1"
      }
    });

    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        //console.log(this.responseText);
        var myObj1 = JSON.parse(this.responseText);
        executionID = this.getResponseHeader("execution");
        console.log(this.getResponseHeader("execution"));


        var o = {} // empty Object
        var key = 'flights';
        o[key] = [];

        var flgihtno = "";
        // for (var key in myObj1)
        {


          {


            for (var i = 0; i < myObj1.unbundledOffers[0].length; i++) {

              flgihtno = "";


              stringFlight = "";
              /// Need to Iterate the Connection Information
              for (var j = 0; j < myObj1.unbundledOffers[0][i]["itineraryPart"][0]["segments"].length; j++) {


                if (myObj1.unbundledOffers[0][i]["itineraryPart"][0]["segments"][j]["origin"] != null) {



                  flgihtno += myObj1.unbundledOffers[0][i]["itineraryPart"][0]["segments"][j]["flight"]["airlineCode"] + myObj1.unbundledOffers[0][i]["itineraryPart"][0]["segments"][j]["flight"]["flightNumber"] + ",";

                  stringFlight += myObj1.unbundledOffers[0][i]["itineraryPart"][0]["segments"][j]["flight"]["airlineCode"] + myObj1.unbundledOffers[0][i]["itineraryPart"][0]["segments"][j]["flight"]["flightNumber"] + ";";
                  //stringFlight+= myObj1.unbundledOffers[0][i]["itineraryPart"][0]["segments"][j]["flight"]["flightNumber"]+ ";";
                  stringFlight += myObj1.unbundledOffers[0][i]["itineraryPart"][0]["segments"][j]["flight"]["operatingAirlineCode"] + ";";

                  stringFlight += myObj1.unbundledOffers[0][i]["itineraryPart"][0]["segments"][j]["origin"] + ";";
                  stringFlight += myObj1.unbundledOffers[0][i]["itineraryPart"][0]["segments"][j]["destination"] + ";";
                  stringFlight += myObj1.unbundledOffers[0][i]["itineraryPart"][0]["segments"][j]["bookingClass"] + ";";

                  stringFlight += myObj1.unbundledOffers[0][i]["itineraryPart"][0]["segments"][j]["departure"] + ";";
                  stringFlight += myObj1.unbundledOffers[0][i]["itineraryPart"][0]["segments"][j]["arrival"] + ";";

                  stringFlight += myObj1.unbundledOffers[0][i]["itineraryPart"][0]["segments"][j]["equipment"] + ";";
                  stringFlight += getTimeFromMins(myObj1.unbundledOffers[0][i]["itineraryPart"][0]["segments"][j]["duration"]) + "@";


                  // console.log("***********************************************************************")
                }
              }


              var dats = ContructSearchFlight(flgihtno, myObj1.unbundledOffers[0][i]["shoppingBasketHashCode"], myObj1.unbundledOffers[0][i]["brandId"], myObj1.unbundledOffers[0][i]["soldout"], myObj1.unbundledOffers[0][i]["cabinClass"], myObj1.unbundledOffers[0][i]["total"]["alternatives"][0][0]["currency"], myObj1.unbundledOffers[0][i]["total"]["alternatives"][0][0]["amount"], stringFlight);

              o[key].push(dats);

              //  console.log("-------------------------------------------------------------------------")

            }




            var jsonString1 = JSON.stringify(o[key]);

            // console.log(jsonString1);
            var objFlights = JSON.parse(jsonString1);

            console.log(objFlights);

            var uniqueNames = [];
            for (i = 0; i < objFlights.length; i++) {
              if (uniqueNames.indexOf(objFlights[i]["flightNo"]) === -1) {
                uniqueNames.push(objFlights[i]["flightNo"]);
              }
            }
            // console.log(uniqueNames);

            // console.log(objFlights);
            BuildFligt(objFlights, uniqueNames)



          }
        }


      }
    });

    xhr.open("POST", "https://api.us.apiconnect.ibmcloud.com/etihad-ea-sandbox/sb/eybooking/search");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
    xhr.send(data);
  }






  function GetCardType(number) {
    // visa
    var re = new RegExp("^4");
    if (number.match(re) != null)
      return "VI";

    // Mastercard 
    // Updated for Mastercard 2017 BINs expansion
    if (/^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(number))
      return "CA";

    // AMEX
    re = new RegExp("^3[47]");
    if (number.match(re) != null)
      return "AX";

    // Discover
    re = new RegExp("^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)");
    if (number.match(re) != null)
      return "Discover";

    // Diners
    re = new RegExp("^36");
    if (number.match(re) != null)
      return "Diners";

    // Diners - Carte Blanche
    re = new RegExp("^30[0-5]");
    if (number.match(re) != null)
      return "Diners - Carte Blanche";

    // JCB
    re = new RegExp("^35(2[89]|[3-8][0-9])");
    if (number.match(re) != null)
      return "JCB";

    // Visa Electron
    re = new RegExp("^(4026|417500|4508|4844|491(3|7))");
    if (number.match(re) != null)
      return "Visa Electron";

    return "";
  }



  /// TO ge the FLight Details
  function BuildFligt(singleFlight, uniqueNames) {

    var flto = {} // empty Object
    var key = 'flights';
    flto[key] = [];




    var cabinClass = "";

    var flightNo = "";
    var shoppingBasketHashCode_Val = "";
    var bookingClass_val = "";
    var flightDetails_dt = "";


    var brandId_dt_YV = "";
    var brandId_dt_YF = "";
    var brandId_dt_YB = "";
    var brandId_dt_YS = "";
    var brandId_dt_JB = "";
    var brandId_dt_JF = "";
    var brandId_dt_JS = "";
    var brandId_dt_FI = "";
    var brandId_dt_TR = "";
    var brandId_dt_GF = "";
    var brandId_dt_GJ = "";
    var brandId_dt_GY = "";

    for (var i = 0; i < uniqueNames.length; i++) {

      for (var j = 0; j < singleFlight.length; j++) {



        // console.log(singleFlight[j]);
        if (uniqueNames[i] === singleFlight[j]["flightNo"]) {


          cabinClass = singleFlight[j]["brandId"];
          // console.log(cabinClass);
          shoppingBasketHashCode_Val = singleFlight[j]["shoppingBasketHashCode"];
          // console.log(shoppingBasketHashCode_Val);
          flightDetails_dt = singleFlight[j]["flightDetails"];
          // console.log(flightDetails_dt);

          bookingClass_val = singleFlight[j]["cabinClass"];
          //console.log(bookingClass_val);
          flightNo = singleFlight[j]["flightNo"]
          // console.log(flightNo);

          switch (cabinClass) {

            case "YV":
              brandId_dt_YV = singleFlight[j]["shoppingBasketHashCode"] + "@" + singleFlight[j]["brandId"] + "@" + singleFlight[j]["cabinClass"] + "@" + singleFlight[j]["amount"] + "@" + singleFlight[j]["currency"] + "@" + singleFlight[j]["soldout"] + "@" + singleFlight[j]["cabinClass"] + "~";


              // console.log(brandId_dt_YV);
              break;
            case "YF":
              brandId_dt_YF = singleFlight[j]["shoppingBasketHashCode"] + "@" + singleFlight[j]["brandId"] + "@" + singleFlight[j]["cabinClass"] + "@" + singleFlight[j]["amount"] + "@" + singleFlight[j]["currency"] + "@" + singleFlight[j]["soldout"] + "@" + singleFlight[j]["cabinClass"];

              //console.log( brandId_dt_YF);
              break;
            case "YB":
              brandId_dt_YB = singleFlight[j]["shoppingBasketHashCode"] + "@" + singleFlight[j]["brandId"] + "@" + singleFlight[j]["cabinClass"] + "@" + singleFlight[j]["amount"] + "@" + singleFlight[j]["currency"] + "@" + singleFlight[j]["soldout"] + "@" + singleFlight[j]["cabinClass"];

              //console.log(brandId_dt_YB);
              break;
            case "YS":
              brandId_dt_YS = singleFlight[j]["shoppingBasketHashCode"] + "@" + singleFlight[j]["brandId"] + "@" + singleFlight[j]["cabinClass"] + "@" + singleFlight[j]["amount"] + "@" + singleFlight[j]["currency"] + "@" + singleFlight[j]["soldout"] + "@" + singleFlight[j]["cabinClass"];

              //console.log(brandId_dt_YS);
              break;
            case "JB":
              brandId_dt_JB = singleFlight[j]["shoppingBasketHashCode"] + "@" + singleFlight[j]["brandId"] + "@" + singleFlight[j]["cabinClass"] + "@" + singleFlight[j]["amount"] + "@" + singleFlight[j]["currency"] + "@" + singleFlight[j]["soldout"] + "@" + singleFlight[j]["cabinClass"];

              // console.log(brandId_dt_JB);
              break;
            case "JF":
              brandId_dt_JF = singleFlight[j]["shoppingBasketHashCode"] + "@" + singleFlight[j]["brandId"] + "@" + singleFlight[j]["cabinClass"] + "@" + singleFlight[j]["amount"] + "@" + singleFlight[j]["currency"] + "@" + singleFlight[j]["soldout"] + "@" + singleFlight[j]["cabinClass"];

              //console.log(brandId_dt_JF);
              break;
            case "JS":
              brandId_dt_JS = singleFlight[j]["shoppingBasketHashCode"] + "@" + singleFlight[j]["brandId"] + "@" + singleFlight[j]["cabinClass"] + "@" + singleFlight[j]["amount"] + "@" + singleFlight[j]["currency"] + "@" + singleFlight[j]["soldout"] + "@" + singleFlight[j]["cabinClass"];
              //  console.log(brandId_dt_JS);

              break;
            case "FI":
              brandId_dt_FI = singleFlight[j]["shoppingBasketHashCode"] + "@" + singleFlight[j]["brandId"] + "@" + singleFlight[j]["cabinClass"] + "@" + singleFlight[j]["amount"] + "@" + singleFlight[j]["currency"] + "@" + singleFlight[j]["soldout"] + "@" + singleFlight[j]["cabinClass"];
              //console.log(brandId_dt_FI);


              break;
            case "TR":
              brandId_dt_TR = singleFlight[j]["shoppingBasketHashCode"] + "@" + singleFlight[j]["brandId"] + "@" + singleFlight[j]["cabinClass"] + "@" + singleFlight[j]["amount"] + "@" + singleFlight[j]["currency"] + "@" + singleFlight[j]["soldout"] + "@" + singleFlight[j]["cabinClass"];
              // console.log(brandId_dt_TR);

              break;
            case "GF":
              brandId_dt_GF = singleFlight[j]["shoppingBasketHashCode"] + "@" + singleFlight[j]["brandId"] + "@" + singleFlight[j]["cabinClass"] + "@" + singleFlight[j]["amount"] + "@" + singleFlight[j]["currency"] + "@" + singleFlight[j]["soldout"] + "@" + singleFlight[j]["cabinClass"];
              console.log(brandId_dt_GF);
              break;
            case "GJ":
              brandId_dt_GJ = singleFlight[j]["shoppingBasketHashCode"] + "@" + singleFlight[j]["brandId"] + "@" + singleFlight[j]["cabinClass"] + "@" + singleFlight[j]["amount"] + "@" + singleFlight[j]["currency"] + "@" + singleFlight[j]["soldout"] + "@" + singleFlight[j]["cabinClass"];

              //console.log(brandId_dt_GJ);
              break;
            case "GY":
              brandId_dt_GY = singleFlight[j]["shoppingBasketHashCode"] + "@" + singleFlight[j]["brandId"] + "@" + singleFlight[j]["cabinClass"] + "@" + singleFlight[j]["amount"] + "@" + singleFlight[j]["currency"] + "@" + singleFlight[j]["soldout"]; + "@" + singleFlight[j]["cabinClass"];
              //console.log(brandId_dt_GY);
              break;


          }



        }


      }


      //console.log( datas);
      var datas = buildSingleFlight(flightNo, shoppingBasketHashCode_Val, cabinClass, "", bookingClass_val, "", "", brandId_dt_YV, brandId_dt_YF, brandId_dt_YB, brandId_dt_YS, brandId_dt_JB, brandId_dt_JF, brandId_dt_JS, brandId_dt_FI, brandId_dt_TR, flightDetails_dt)
      flto[key].push(datas);
      brandId_dt_YV = "";
      brandId_dt_YF = "";
      brandId_dt_YB = "";
      brandId_dt_YS = "";
      brandId_dt_JB = "";
      brandId_dt_JF = "";
      brandId_dt_JS = "";
      brandId_dt_FI = "";
      brandId_dt_TR = "";
      brandId_dt_GF = "";
      brandId_dt_GJ = "";
      brandId_dt_GY = "";



    }
    console.log("Final Flight");
    console.log(flto[key]);

    var finalFlightList = JSON.stringify(flto[key]);

    //console.log(finalFlightList);
    BuildLineItem(finalFlightList);

  }

  function loadJSON(callback) {

    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', '/js/airports.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
      if (xobj.readyState == 4 && xobj.status == "200") {
        // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
        callback(xobj.responseText);
      }
    };
    xobj.send(null);



  }


  function findAirport(data, cityName) {



    // iterate over each element in the array
    for (var i = 0; i < data.length; i++) {
      // look for the entry with a matching `code` value
      if (data[i].city.toLowerCase() == cityName.toLowerCase()) {
        return data[i].code;
      }
    }

  }



  function BuildLineItem(finalFlightList) {





    var promise1 = new Promise(function (resolve, reject) {
      var data = null;

      var xhr = new XMLHttpRequest();
      xhr.withCredentials = true;

      xhr.addEventListener("readystatechange", function () {
        if (this.readyState === 4) {
          //console.log(this.responseText);
          resolve(this.responseText);
          //return (this.responseText);

        }
      });

      xhr.open("GET", "https://api.us.apiconnect.ibmcloud.com/etihad-ea-sandbox/sb/hotels/list");

      xhr.send(data);

    });


    var hotelRows = "";
    promise1.then(function (value) {

      var hotelpayload = JSON.parse(value); 5
      hotelRows += "<tr> <th bgcolor='#4E4C4A'><table style='100%;border:0!important'><tbody><tr style='color:white'><td align='left' style='width:50%'>Hotels </td><td></td></tr></tbody></table></th></tr><tr><td><div id='scroll'> <ul>";
      // console.log(hotelpayload);
      for (var i = 0; i < hotelpayload.items.length; i++) {
        //Pull Hotel details
        hotelRows += "<li style='width:100px'><table style='width:100px' align='center'>    <tr>  <td><input type='radio' name='select' value='hotel'+" + hotelpayload.items[i].id + "> Select </td> </tr><tr>   <td><img width='100px' height='100px' src='" + hotelpayload.items[i].imgurl + "' alt=''></td> </tr>   <tr> <td><label style='max-width: 100px; word-wrap: break-word' >" + hotelpayload.items[i].name + "</label></td>  </tr>   <tr> <td><b>" + hotelpayload.items[i].rate + "</b><td>  </tr>  </table></li> ";

        //End Hotel Details   
        console.log(hotelpayload.items[0].name);





      }
      hotelRows += " </ul> </div></td></tr>";
      var objFlights = JSON.parse(finalFlightList);

      buildFlight = "";
      var YB = "";
      var YF = "";
      var YS = "";
      var YV = "";

      buildFlight += "<table class='formTile'>";
      for (var i = 0; i < objFlights.length; i++) {


        buildFlight += splitString(objFlights[i]["flightDetails_dt"], objFlights[i]["flightNo"]);

        YB = objFlights[i]["YB"].split('@');
        YF = objFlights[i]["YF"].split('@');
        YS = objFlights[i]["YS"].split('@');
        YV = objFlights[i]["YV"].split('@');



        buildFlight += "<tr>";
        buildFlight += "<td>";
        buildFlight += "<table style='width:100%;backgroud:#e5a72c!important'>";
        buildFlight += " <tr>";


        if (objFlights[i]["YB"].length > 2 || YB[5] == "true") {
          buildFlight += "<td align ='center' style='padding:5px;backgroud:#e5a72c;font-size: 10pt;color:black' bgcolor='#F7F7F7'> <input type='radio' id='r1' name='rate' value='" + YB[0] + "' onclick='ConversationPanel.togglePanelA(event,this)' />Deal<br/>" + YB[3] + " " + YB[4] + "</td>";
        }

        else {

          buildFlight += "<td align ='center' style='padding:5px;backgroud:#e5a72c;font-size: 10pt;color:black' bgcolor='#F7F7F7'>Deal<br/>Sold out</td>";
        }
        // buildFlight += "<td style='padding:5px;backgroud:#e5a72c'>Saver<br/>"+YS[3]+ " " +  YS[4] +"</td>";

        if (objFlights[i]["YS"].length > 2 || YS[5] == "true") {
          buildFlight += "<td align ='center' style='padding:5px;backgroud:#e5a72c;font-size: 10pt;color:black' bgcolor='#F7F7F7'><input type='radio' id='r1' name='rate' value='" + YS[0] + "' onclick='ConversationPanel.togglePanelA(event, this)'  />Saver<br/>" + YS[3] + " " + YS[4] + "</td>";
        }

        else {

          buildFlight += "<td align ='center' style='padding:5px;backgroud:#e5a72c;font-size: 10pt;color:black' bgcolor='#F7F7F7'>Saver<br/>Sold out</td>";
        }



        //buildFlight += "<td style='padding:5px;backgroud:#e5a72c'>Value<br/>"+YV[3]+ " " +  YV[4] +"</td>";


        if (objFlights[i]["YV"].length > 2 || YV[5] == "true") {
          buildFlight += "<td align ='center' style='padding:5px;backgroud:#e5a72c;font-size: 10pt;color:black' bgcolor='#F7F7F7'><input type='radio' id='r1' name='rate' value='" + YV[0] + "'  onclick='ConversationPanel.togglePanelA(event,this)'  />Value<br/>" + YV[3] + " " + YV[4] + "</td>";
        }

        else {

          buildFlight += "<td align ='center' style='padding:5px;backgroud:#e5a72c;font-size: 10pt;color:black' bgcolor='#F7F7F7'>Value<br/>Sold out</td>";

        }

        if (objFlights[i]["YF"].length > 2 || YF[5] == "true") {
          buildFlight += "<td align ='center' style='padding:5px;backgroud:#e5a72c;font-size: 10pt;color:black' bgcolor='#F7F7F7'><input type='radio' id='r1' name='rate' value='" + YF[0] + "' onclick='ConversationPanel.togglePanelA(event, this)'  />Freedom<br/>" + YF[3] + " " + YF[4] + "</td>";
        }

        else {

          buildFlight += "<td align ='center' style='padding:5px;backgroud:#e5a72c;;color:black' bgcolor='#F7F7F7'>Freedom<br/>Sold out</td>";
        }

        buildFlight += "</tr>";
        buildFlight += "</table>";
        buildFlight += "</td>";
        buildFlight += "</tr>";
        YB = "";
        YF = "";
        YS = "";
        YV = "";

        buildFlight += hotelRows;


      }



      buildFlight += " </table>";
      console.log(buildFlight);
      var chatBoxElement1 = document.getElementById("scrollingChat");
      chatBoxElement1.innerHTML += buildFlight;
    });





  }





  function splitString(flihtDetails, fltNo) {


    var flightString = "";


    //flightString += "<table class='demo'>";
    flightString += "<tr>";
    flightString += " <th bgcolor='#C4921E' ><table style='100%;border:0!important' ><tr style='color:white'><td align='left' style='width:50%'>" + fltNo + " <td><td align='right' style='width:50%'><img src='/img/tail.png' border='' width='20px' /><td></tr></table></th>";
    flightString += "</tr>";


    var globalFileTypeId = flihtDetails.split('@');
    var lastrow = 0;
    for (i = 0; i < globalFileTypeId.length; i++) {
      //console.log(globalFileTypeId);
      var eachflith = globalFileTypeId[i].split(';');
      //console.log(eachflith);

      if (eachflith.length > 2) {

        date = new Date(eachflith[5]);
        year = date.getFullYear();
        month = date.getMonth() + 1;
        dt = date.getDate();

        if (dt < 10) {
          dt = '0' + dt;
        }
        if (month < 10) {
          month = '0' + month;
        }

        console.log(year + '-' + month + '-' + dt);

        flightString += "<tr>";
        flightString += " <td>" + eachflith[2] + "</td>";
        flightString += " </tr>";
        flightString += "<tr>";
        flightString += "   <td>" + formatDate(eachflith[5]) + " </td>";
        flightString += " </tr>";
        flightString += " <tr>";
        flightString += "  <td>" + eachflith[8] + "</td>";
        flightString += "  </tr>";
        flightString += " <tr>";
        flightString += "   <td>" + formatDate(eachflith[6]) + "</td>";
        flightString += " </tr>";
        lastrow = lastrow + 1;
        if (lastrow > 0) {

          flightString += "  <tr class='amee'>";
        }
        else {

          flightString += "  <tr >";

        }
        flightString += "   <td>" + eachflith[3] + "</td>";
        flightString += " </tr>";



      }
      // }


    }



    return flightString;




  }

  function formatDate(date) {
    var d = new Date(date);
    var hh = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    var dd = "AM";
    var h = hh;
    if (h >= 12) {
      h = hh - 12;
      dd = "PM";
    }
    if (h == 0) {
      h = 12;
    }
    m = m < 10 ? "0" + m : m;

    s = s < 10 ? "0" + s : s;

    /* if you want 2 digit hours:
    h = h<10?"0"+h:h; */

    var pattern = new RegExp("0?" + hh + ":" + m + ":" + s);

    var replacement = h + ":" + m;
    /* if you want to add seconds
    replacement += ":"+s;  */
    replacement += " " + dd;

    return date.replace(pattern, replacement);
  }

  function buildSingleFlight(flightNo1, shoppingBasketHashCode1, brandId1, soldout1, cabinClass1, currency1, amount1, YV1, YF1, YB1, YS1, JB1, JF1, JS1, FI1, TR1, flightDetails_dt1) {
    data1 = "";
    var flight = {} // empty Object

    // empty Array, which you can push() values into
    // flgihtno1 = flightNo1.replace(/,\s*$/, "");
    data1 = {
      flightNo: flightNo1,
      shoppingBasketHashCode: shoppingBasketHashCode1,
      brandId: brandId1,
      soldout: soldout1,
      cabinClass: cabinClass1,
      currency: currency1,
      amount: amount1,
      YV: YV1,
      YF: YF1,
      YB: YB1,
      YS: YS1,
      JB: JB1,
      JF: JF1,
      JS: JS1,
      FI: FI1,
      TR: TR1,
      flightDetails_dt: flightDetails_dt1
    };

    return data1;

  }


  function removeDuplicates(arr, key) {
    if (!(arr instanceof Array) || key && typeof key !== 'string') {
      return false;
    }

    if (key && typeof key === 'string') {
      return arr.filter((obj, index, arr) => {
        return arr.map(mapObj => mapObj[key]).indexOf(obj[key]) === index;
      });

    } else {
      return arr.filter(function (item, index, arr) {
        return arr.indexOf(item) == index;
      });
    }
  }



  function GetUniqueFlight(data) {
    var birthDates = {};
    var param = "flightNo"
    $.each(data.flightNo, function () {
      if (!birthDates[this[param]])
        birthDates[this[param]] = [];
      birthDates[this[param]].push(this);
    });



    return birthDates;
  }




  function ContructSearchFlight(flightNo1, shoppingBasketHashCode1, brandId1, soldout1, cabinClass1, currency1, amount1, flightDetails1) {
    var o = {} // empty Object
    var key = 'flights';
    o[key] = [];
    // empty Array, which you can push() values into
    flgihtno1 = flightNo1.replace(/,\s*$/, "");
    var data = {
      flightNo: flgihtno1,
      shoppingBasketHashCode: shoppingBasketHashCode1,
      brandId: brandId1,
      soldout: soldout1,
      cabinClass: cabinClass1,
      currency: currency1,
      amount: amount1,
      flightDetails: flightDetails1
    };

    return data;
    // o[key].push(data);
    // console.log(o[key])

  }



  function ContructSingleFlight(flightNo1, brandId1, shoppingBasketHashCode1, soldout1, cabinClass1, currency1, amount1, flightDetails1) {
    var o = {} // empty Object
    var key = 'flights';
    o[key] = [];
    // empty Array, which you can push() values into
    flgihtno1 = flightNo1.replace(/,\s*$/, "");
    var data = {
      flightNo: flgihtno1,
      shoppingBasketHashCode: shoppingBasketHashCode1,
      brandId: brandId1,
      soldout: soldout1,
      cabinClass: cabinClass1,
      currency: currency1,
      amount: amount1,
      flightDetails: flightDetails1
    };

    return data;
    // o[key].push(data);
    // console.log(o[key])

  }




  // Display a user or Watson message that has just been sent/received
  function displayMessage(newPayload, typeValue) {

    var isBot = (newPayload.output && newPayload.output.text);


    var isUser = isUserMessage(typeValue);
    var textExists = (newPayload.input && newPayload.input.text)
      || (newPayload.output && newPayload.output.text);
    if (isUser !== null && textExists) {
      // Create new message DOM element


      var messageDivs = buildMessageDomElements(newPayload, isUser);
      var chatBoxElement = document.querySelector(settings.selectors.chatBox);

      var previousLatest = chatBoxElement.querySelectorAll((isUser
        ? settings.selectors.fromUser : settings.selectors.fromWatson)
        + settings.selectors.latest);

      if (previousLatest) {
        Common.listForEach(previousLatest, function (element) {
          element.classList.remove('latest');
        });
      }

      messageDivs.forEach(function (currentDiv) {
        chatBoxElement.appendChild(currentDiv);
        // alert(currentDiv.displayMessage.text)
        // Class to start fade in animation
        currentDiv.classList.add('load');
      });
      // Move chat to the most recent messages when new messages are added
      scrollToChatBottom();
    }


    if (typeValue === "watson") {
      // playText("Hello how are you?")
      //testText(newPayload.output.text);
      if (newPayload.output.action === "bookFlight") {

        //GenereateTable();

        if (newPayload.context) {
          // The client must maintain context/state

          console.log(newPayload.context);

          if ((newPayload.context.ToCity != null) || (newPayload.context.FromCity != null)) {


            loadJSON(function (response) {
              // Parse JSON string into object
              actual_JSON = JSON.parse(response);

              frmFlight = findAirport(actual_JSON, newPayload.context.ToCity)
              toFlgiht = findAirport(actual_JSON, newPayload.context.FromCity);
              // lang[0]= (frmFlight);
              // lang[1]= (toFlgiht);

              myFunction(toFlgiht, frmFlight, newPayload.context.Date);

            });


          }

        }




      }


    }

  }

  ///Convert Minute

  function getTimeFromMins(minutes) {
    var sign = '';
    if (minutes < 0) {
      sign = '-';
    }

    var hours = leftPad(Math.floor(Math.abs(minutes) / 60));
    var minutes = leftPad(Math.abs(minutes) % 60);

    return sign + hours + 'hrs ' + minutes + 'min';

  }
  function leftPad(number) {
    return ((number < 10 && number >= 0) ? '0' : '') + number;
  }





  // Checks if the given typeValue matches with the user "name", the Watson "name", or neither
  // Returns true if user, false if Watson, and null if neither
  // Used to keep track of whether a message was from the user or Watson
  function isUserMessage(typeValue) {
    if (typeValue === settings.authorTypes.user) {
      return true;
    } else if (typeValue === settings.authorTypes.watson) {
      return false;
    }
    return null;
  }



  // Constructs new DOM element from a message payload
  function buildMessageDomElements(newPayload, isUser) {
    var textArray = isUser ? newPayload.input.text : newPayload.output.text;
    if (Object.prototype.toString.call(textArray) !== '[object Array]') {
      textArray = [textArray];
    }
    var messageArray = [];

    textArray.forEach(function (currentText) {
      //  alert(currentText)
      if (currentText) {
        var messageJson = {
          // <div class='segments'>
          'tagName': 'div',
          'classNames': ['segments'],
          'children': [{
            // <div class='from-user/from-watson latest'>
            'tagName': 'div',
            'classNames': [(isUser ? 'from-user' : 'from-watson'), 'latest', ((messageArray.length === 0) ? 'top' : 'sub')],
            'children': [{
              // <div class='message-inner'>
              'tagName': 'div',
              'classNames': ['message-inner'],
              'children': [{
                // <p>{messageText}</p>
                'tagName': 'p',
                'text': currentText
              }]
            }]
          }]
        };
        messageArray.push(Common.buildDomElement(messageJson));
      }
    });

    return messageArray;
  }

  // Scroll to the bottom of the chat window (to the most recent messages)
  // Note: this method will bring the most recent user message into view,
  //   even if the most recent message is from Watson.
  //   This is done so that the "context" of the conversation is maintained in the view,
  //   even if the Watson message is long.
  function scrollToChatBottom() {
    var scrollingChat = document.querySelector('#scrollingChat');

    // Scroll to the latest message sent by the user
    var scrollEl = scrollingChat.querySelector(settings.selectors.fromUser
      + settings.selectors.latest);
    if (scrollEl) {
      scrollingChat.scrollTop = scrollEl.offsetTop;
    }
  }


  function scrollToChatBottomText() {
    var scrollingChat = document.querySelector('#scrollingChat');
    scrollingChat.scrollTop = scrollingChat.scrollHeight;

  }




  // Handles the submission of input
  function inputKeyDown(event, inputBox) {

    // Submit on enter key, dis-allowing blank messages
    if (event.keyCode === 13 && inputBox.value) {
      // Retrieve the context from the previous server response
      var context;
      var latestResponse = Api.getResponsePayload();
      if (latestResponse) {
        context = latestResponse.context;
      }

      // Send the user message
      Api.sendRequest(inputBox.value, context);

      // Clear input box for further messages
      inputBox.value = '';
      Common.fireEvent(inputBox, 'input');
    }
  }

}());
