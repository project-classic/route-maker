const waypointList = document.getElementById('waypointList');
var WAYPOINTS = [];
let quests = [];

function load(){
    var sel = document.getElementById('mapChoice');
    getZones().then(zones => {
        for (var x in zones) {
            var opt = document.createElement('option');
            opt.appendChild(document.createTextNode(zones[x]));
            opt.value = x;
            opt.label = zones[x];
            sel.appendChild(opt);
        }
    });
    quests = getQuests();
};

function changeMap(select){
    // document.getElementById("map").style.backgroundImage = "url('" + MAPS[select.options[select.selectedIndex].getAttribute("value")][1] + "')";
    document.getElementById("map").style.backgroundImage = 'url(./maps/' + select.options[select.selectedIndex].getAttribute("label") + '.jpg)';
}

function showCoords(event) {
    var x = Math.round((event.clientX / 1008) * 100);
    var y = Math.round((event.clientY / 668) * 100);
    document.getElementById("x").innerHTML = x;
    document.getElementById("y").innerHTML = y;
    var coords = "X coords: " + x + ", Y coords: " + y;
}

function createWaypoint(event){
    var wpObj = {};
    var coords = {};
    wpObj.objectives = [];
    coords.x = event.clientX;
    coords.y = event.clientY;
    wpObj.coords = coords;
    WAYPOINTS.push(wpObj);

    var wp = document.createElement("img");
    wp.className = "waypoint";
    wp.setAttribute("src", "waypoint.png");
    wp.style.left = Math.round(event.clientX) + "px";
    wp.style.top = Math.round(event.clientY) + "px";
    document.getElementById("map").appendChild(wp);
    updateList();
    updateMap();
}

function updateMap(){
    var appendString = "";
    for(var i = 0; i < WAYPOINTS.length; i++){
        appendString += '<img class="waypoint" src="waypoint.png" style="left: ' + WAYPOINTS[i].coords.x + 'px; top: '+ WAYPOINTS[i].coords.y + 'px;"></img>';
        /*if((WAYPOINTS.lenghth > 1) && (i+1 < WAYPOINTS.length)){
            lineString = '<line x1="' + WAYPOINTS[i].coords.x + '" y1="' + WAYPOINTS[i].coords.y + 
            'x2="' + WAYPOINTS[i+1].coords.x + '" y2="' + WAYPOINTS[i+1].coords.y + '" style="stroke:rgb(255,0,0);stroke-width:2"/>';
        }*/
    }
    appendString += '<svg height="100%" width="100%" id="lineCanvas"></svg>';
    document.getElementById("map").innerHTML = appendString;

    for(var i = 0; i < WAYPOINTS.length; i++){
        if((WAYPOINTS.length > 1) && (i+1 < WAYPOINTS.length)){
            var line = document.createElementNS('http://www.w3.org/2000/svg','line');
            line.setAttribute('x1', WAYPOINTS[i].coords.x);
            line.setAttribute('y1', WAYPOINTS[i].coords.y);
            line.setAttribute('x2', WAYPOINTS[i+1].coords.x);
            line.setAttribute('y2', WAYPOINTS[i+1].coords.y);
            line.setAttribute("stroke", "red");
            line.setAttribute("stroke-width", "2");
            document.getElementById("lineCanvas").append(line);
        }
    }
    //var line = '<line x1="0" y1="0" x2="200" y2="200" style="stroke:rgb(255,0,0);stroke-width:2" />';
}
  
function removeWaypoint(index){
    WAYPOINTS.splice(index, 1);
    updateList();
    updateMap();
}
  
function addObjective(index){
    var objective = {};
    objective.type = "accept";
    if(document.getElementById("radioNote" + index).checked){ //is a note
        objective.type = "note";
        objective.description = document.getElementById("textDescription" + index).value;
        WAYPOINTS[index].objectives.push(objective);
        updateList();
    }
    else{ //is a quest
        if(document.getElementById("radioComplete" + index).checked){
            objective.type = "complete";
        }
        else if(document.getElementById("radioQuest" + index).checked){
            objective.type = "quest";
        }
        if(document.getElementById("textQuestID" + index).value != ""){//ID exists
            objective.id = document.getElementById("textQuestID" + index).value;
            objective.quest = quests[document.getElementById("textQuestID" + index).value].name;
            objective.description = document.getElementById("textDescription" + index).value;
            WAYPOINTS[index].objectives.push(objective);
            updateList();
        }
        else{ //No idea entered
            var check = checkDuplicate(document.getElementById("textQuest" + index).value);
            if(!check.exists){ //Quest name does not exist
                document.getElementById("error" + index).innerHTML = "Quest name doesn't exist"
            }
            else if(check.exists && check.duplicate){ //Duplicates exists
                document.getElementById("error" + index).innerHTML = "Duplicates: {" + check.ids + "}";
            }
            else{//Quest name exists, no duplicates
                objective.id = check.ids[0];
                objective.quest = document.getElementById("textQuest" + index).value;
                objective.description = document.getElementById("textDescription" + index).value;
                WAYPOINTS[index].objectives.push(objective);
                updateList();
            }
        }
    }
}

function checkDuplicate(questName){
    var questIds = [];
    var count = 0;
    for(var i in quests){
        if(questName.toLowerCase() == quests[i].name.toLowerCase()){
            count++;
            questIds.push(i);
        }
    }
    if(count > 1){
        return {duplicate: true, exists: true, ids: questIds};
    }
    else if(count == 1){
        return {duplicate: false, exists: true, ids: questIds};
    }
    else{
        return {duplicate: false, exists: false};
    }
}
  
function removeObjective(wpIndex, objIndex){
    WAYPOINTS[wpIndex].objectives.splice(objIndex, 1);
    updateList();
}
  
function updateList(){
    var appendString = "";
    for(var i = 0; i < WAYPOINTS.length; i++){
      appendString += '</br><div class="waypointContainer" id="waypoint' + i + '">' + Number(i+1) + 
      '. Waypoint added at: (' + Math.round((WAYPOINTS[i].coords.x / 1008) * 100) + ',' + Math.round((WAYPOINTS[i].coords.y / 668) * 100) 
      + ')<button onclick="removeWaypoint(' + i + ')">Remove</buttton></button>Quest ID:<input type="text" id="textQuestID' + i + '"><span class="error" id="error' + i + '"></span>';
      appendString += '<div><form id="form' + i + '">Type: <input type="radio" name="type" value="accept" id="radioAccept' + i + '" checked/> accept';
      appendString += '<input type="radio" name="type" value="complete" id="radioComplete' + i + '"> complete';
      appendString += '<input type="radio" name="type" value="quest" id="radioQuest' + i + '"> quest';
      appendString += '<input type="radio" name="type" value="note" id="radioNote' + i + '"> note';
      appendString += '<span> Quest:</span><input type="text" id="textQuest' + i + '">';
      appendString += '<span> Description:</span><input type="text" class="txtBox" id="textDescription' + i + '">';
      appendString += '<button type="button" onclick="addObjective(' + i + ')">Add Objective</button></form></div>';
      appendString += '<div id="objListWP' + i + '">'
      for(var j = 0; j < WAYPOINTS[i].objectives.length; j++){
        appendString += '<div><button onclick="removeObjective(' + i + ', ' + j + ')">x</buttton></button>' + WAYPOINTS[i].objectives[j].type;
        if(WAYPOINTS[i].objectives[j].type != "note"){
          appendString +=  " [" + WAYPOINTS[i].objectives[j].quest + "] ";
        }
        appendString +=  '"' + WAYPOINTS[i].objectives[j].description + '"</div>';
      }
      appendString += '</div></div></br>';
    }
    waypointList.innerHTML = appendString;
}
  
function getJSON(){
    var jsonObject = {};
    jsonObject.zone = document.getElementById("mapChoice").value;
    if(document.getElementById("experience").value == ""){
        jsonObject.experience = 0;
    }
    else{
        jsonObject.experience = parseFloat(document.getElementById("experience").value);
    }
    jsonObject.waypoints = JSON.parse(JSON.stringify(WAYPOINTS));
    for(var i = 0; i < WAYPOINTS.length; i++){ //Convert coordinates to percentages
        jsonObject.waypoints[i].coords.x = Math.round((jsonObject.waypoints[i].coords.x / 1008) * 100);
        jsonObject.waypoints[i].coords.y = Math.round((jsonObject.waypoints[i].coords.y / 668) * 100);
        jsonObject.waypoints[i].objectives = WAYPOINTS[i].objectives;
    }

    console.log(JSON.stringify(jsonObject));
    document.getElementById("JSONBox").style.visibility = "visible";
    document.getElementById("JSONText").value = JSON.stringify(jsonObject, null, 2);
}

function closeJSON(){
    document.getElementById("JSONBox").style.visibility = "hidden";
}
