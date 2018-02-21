var groups, group;
var adding = false;
main();

function main() {
    retrieveGroups();
}

/* Toggle the class adding menu */
function toggleAddMenu() {
    if(!adding){
        $("#add").addClass("reveal");
        setTimeout(function(){
            $("#add").removeClass("reveal");
            $("#class-name").focus();
        }, 500);
        
        $("#minus").hide();
        $("#add").show();
    }else{
        $("#add").addClass("retract");
        setTimeout(function(){
            $("#minus").show();
            $("#add").hide();
            
            $("#add").removeClass("retract");
        }, 500);
    }
    adding = !adding;
}

/* Retrieve the existing groups from storage and add the html */
function retrieveGroups() {
    $("#list").html('<option value="" disabled selected>Select class</option>');
    groups = localStorage.getItem("groups");
    if(groups && groups != null){
        groups = $.parseJSON(groups);
        for(var i = 0; i < groups.length; i++){
            var group = groups[i];
            addOption(group);
        }
    }
}

/* Get a group by its id */
function getGroup(id) {
    for(var i = 0; i < groups.length; i++){
        var group = groups[i];
        if(group.id == id){
            return group;
        }
    }
}

/* Select a group from the dropdown and add the html */
function selectGroup(existing) {
    var element = document.getElementById("list");
    var id = element.options[element.selectedIndex].value;
    if(!existing){
        group = getGroup(id);
    }
    if(group){
        $("#students-div").show();
        $("#students").html("");
        for(var i = 0; i < group.people.length; i++){
            var person = group.people[i];
            var style = "";
            if(i == 0){
                style = "border: 1px solid rgba(0, 0, 0, 0.5);"
            }else if(i == group.people.length - 1){
                style = "border-bottom: none";
            }
            $("#students").append('<div class="student" style="' + style + '"><p>' + person + '</p></div>');
        }
    }
}

/* Move the list of students over by one */
function nextStudent() {
    group.people.push(group.people.shift());
    selectGroup(true);
    saveNewOrder();
}

/* Add a class to the list */
function addClass() {
    var name = document.getElementById("class-name").value;
    var list = document.getElementById("student-list").value;
    if(name.length == 0){
        shakeElement("class-name");
        return;
    }
    if(list.length == 0){
        shakeElement("student-list");
        return;
    }
    addGroup(name, list);
    retrieveGroups();
    
    toggleAddMenu();
    setTimeout(function(){
        document.getElementById("class-name").value = "";
        document.getElementById("student-list").value = "";
    }, 1000);
}

/* Add a group to storage */
function addGroup(name, stringList) {
    var group = stringList.split(/\r?\n/);
    shuffleArray(group);
    
    var existing = new Array();
    var groups = localStorage.getItem("groups");
    if(groups && groups != null){
        existing = $.parseJSON(groups);
    }
    existing.push({name: name, id: hyphenateString(name), people: group});
    
    localStorage.setItem("groups", JSON.stringify(existing));
}

/* Remove a group from storage and update the html */
function removeGroup() {
    if(group){
        var data = localStorage.getItem("groups");
        if(data && data != null){
            var list = $.parseJSON(data);
            for(var i = 0; i < list.length; i++){
                var g = list[i];
                if(g.id == group.id){
                    list.splice(i, 1);
                    break;
                }
            }
            localStorage.setItem("groups", JSON.stringify(list));
            $("#students-div").hide();
            retrieveGroups();
        }
    }else{
        shakeElement("minus");
    }
}

/* Add a dropdown option for a group */
function addOption(group) {
    var option = document.createElement("option");
    option.text = group.name;
    option.value = group.id;
    
    document.getElementById("list").add(option);
}

/* Reshuffle the student list */
function reshuffle() {
    shuffleArray(group.people);
    selectGroup(true);
    saveNewOrder();
}

/* Save the new student list order */
function saveNewOrder() {
    var data = localStorage.getItem("groups");
    if(data && data != null){
        var list = $.parseJSON(data);
        for(var i = 0; i < list.length; i++){
            var g = list[i];
            if(g.id == group.id){
                list[i].people = group.people;
                break;
            }
        }
        localStorage.setItem("groups", JSON.stringify(list));
    }
}

/* Shake an element */
function shakeElement(element) {
    $("#" + element).addClass("shake");
    setTimeout(function(){
        $("#" + element).removeClass("shake");
    }, 300);
}

/* Hyphenate and lowercase a string */
function hyphenateString(string) {
    return string.toLowerCase().replace(/ /g,"-");
}

/* Randomly shuffle an array */
function shuffleArray(array) {
    for(var i = array.length - 1; i > 0; i--){
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}