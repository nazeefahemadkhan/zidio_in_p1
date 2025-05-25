/** I use and modify code from the google quickstart api.
 * This was the easiest way to get the API running properly**/

// Client ID and API key from the Developer Console
let CLIENT_ID = '1019093233813-anjhbjastfajl4gg1tohr2mjglk3urln.apps.googleusercontent.com';
let API_KEY = 'AIzaSyDHMlT-tG_Zvy44srdeWoBqpCzn7XyGQpI';

// Array of API discovery doc URLs for APIs used by the quickstart
let DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.

let SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

let authorizeButton = document.getElementById('authorize_button');
let signoutButton = document.getElementById('signout_button');

/**
 *  On load, called to load the auth2 library and API client library.
 *  added my initilize to this section.
 */
function handleClientLoad() {
    gapi.load('client:auth2', initClient);
    init();
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    }, function(error) {
        appendPre(JSON.stringify(error, null, 2));
    });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        listUpcomingEvents();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 *  Updated to remove event list on sign out.
 */
function handleSignoutClick(event) {
    let g_container = document.getElementById("gevent-list")
    g_container.innerHTML = "";
    gapi.auth2.getAuthInstance().signOut();
}

/**
 * Modified this section of the api code to create interactive div elements.
 */
function appendPre(message) {
    let g_container = document.getElementById('gevent-list');
    let g_event = document.createElement("div");
    let g_text = document.createTextNode(message);
    g_event.className = "gevent";
    g_event.appendChild(g_text);
    g_container.appendChild(g_event);
}

/**
 * Print the summary and start datetime/date of the next ten events in
 * the authorized user's calendar. If no events are found an
 * appropriate message is printed.
 */
function listUpcomingEvents() {
    gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    }).then(function(response) {
        let events = response.result.items;

        if (events.length > 0) {
            for (let i = 0; i < events.length; i++) {
                let event = events[i];
                let when = event.start.dateTime;
                if (!when) {
                    when = event.start.date;
                }
                appendPre(event.summary)
            }
        } else {
            appendPre('No upcoming events found.');
        }
    });
}

//*My code starts here**//

/* loads the google calander api on load*/
window.addEventListener("load", handleClientLoad);

/*global variables*/
let current_overlay = null;

/*initilizer*/
function init(){
    g_task_selector();
    id("authorize_button").addEventListener("click", g_task_selector);
    id("g-container").addEventListener("change", g_task_selector);
    id("add-task").addEventListener("click", addTask_btn);
    let close_btn = cn("close");
    for (let i = 0; i<close_btn.length; i++){
        close_btn[i].addEventListener("click", function(){
            close(current_overlay);
        });
    };
    id("task-submit").addEventListener("click", addTask);
    id("gtask-submit").addEventListener("click", addGTask);
    let edit_btn = cn("edit");
    for (let j = 0; j<edit_btn.length; j++){
        edit_btn[j].addEventListener("click", function (){
            edit(j);
        })
    };
    let del_btn = cn("del");
    for (let k = 0; k<del_btn.length; k++){
        del_btn[k].addEventListener("click", function (){
            del(k);
        })
    }
    id("Pomodoro-timer-init").addEventListener("click", go_to_pom)
}

/*used to change gevent class and add selected to task list*/
function g_task_selector(){
    let g_event_list = cn("gevent");
    for (let i = 0; i<g_event_list.length; i++){
        g_event_list[i].addEventListener("click",function(){
            /*add or removes gevent-click class*/
            g_event_list[i].classList.toggle("gevent-click");
            /* if the element no longer has the gevent-click className
            remove it from Task List.
             */
            if (g_event_list[i].className=="gevent"){
                let task = cn("task");
                for(let j = 0; j<task.length; j++){
                    /* if multiple events have the same name this will be an issue*/
                    if(g_event_list[i].innerText == task[j].innerText){
                        task[j].remove();
                    }
                }
            }
            /* if element has the gevent-click className
            add it to Task List.
             */
            else{
                let gtask = document.createElement("div");
                let task_list = document.getElementById("task-list");
                gtask.innerText = g_event_list[i].innerText;
                gtask.className = "task";
                task_list.appendChild(gtask);
                addGTask_btn(g_event_list[i].innerText);
            }
        });
    }
}

/*shows addTask overlay which is where user inputs task info*/
function addGTask_btn(){
    current_overlay = "add-gtask-overlay";
    id("add-gtask-overlay").style.display = "block";
}

function addTask_btn(){
    current_overlay = "add-task-overlay";
    id("add-task-overlay").style.display = "block";
}

/*generates task*/
function addTask(){
    if (id("task-name").value == ""
    || id("task-priority").value == ""
    || id("task-hour").value == ""
    || id("task-min").value == ""){
        alert("Please Enter Required Fields");
    }
    else{
        /*create task card*/
        let task_name = id("task-name").value;
        let task_container = document.getElementById('task-list');
        let task = document.createElement("div");
        let text = document.createElement("a")
        text.className = "text";
        text.innerText = task_name;
        task.className = "task";
        task.appendChild(text);
        task_container.appendChild(task);

        /*add edit and delete buttons*/
        let del = document.createElement("button");
        del.className = "del";
        del.innerText = "Delete";
        task.appendChild(del);
        let edit = document.createElement("button");
        edit.className = "edit";
        edit.innerText = "Edit";
        task.appendChild(edit);


        /*creates list of task info*/
        let task_info = document.createElement("ul")
        task_info.innerText = "Task Information: ";
        task_info.className = "task-info";
        let task_priority = document.createElement("li");
        task_priority.innerText = "Task Priority: " + id("task-priority").value;
        let task_hour = document.createElement("li");
        task_hour.innerText = "Task Allotted Hours: " + id("task-hour").value;
        let task_min = document.createElement("li");
        task_min.innerText = "Task Allotted Hours: " + id("task-min").value;
        task.appendChild(task_info);
        task_info.appendChild(task_priority);
        task_info.appendChild(task_hour);
        task_info.appendChild(task_min);

        /*add task to schedule*/
        addSchedule(id("task-name").value,
            id("task-priority").value,
            id("task-hour").value,
            id("task-min").value);

        close(current_overlay);
    }
}

/* tasks generated by google events do not need names*/
function addGTask(task_name) {
    if (id("task-priority").value == ""
        || id("task-hour").value == ""
        || id("task-min").value == "") {
        alert("Please Enter Required Fields");
    }
    else{
        close(current_overlay);
    }
}

function addSchedule(task_name_in, task_priority_in, task_hour_in, task_min_in){
    /*create task card*/
    let task = document.createElement("div");
    let text = document.createElement("a")
    text.className = "text";
    text.innerText = task_name_in;
    task.className = "task-schedule";
    task.appendChild(text);

    if (id("task-priority").value == 1){
        let p1 = id("priority1");
        p1.appendChild(task);
    }
    else if (id("task-priority").value == 2){
        let p2 = id("priority2");
        p2.appendChild(task);
    }
    else{
        let p3 = id("priority3");
        p3.appendChild(task);
    }
    let time = id("time");
    let t =  time.innerText.split(":");
    let hour = parseInt(t[0]);
    let min =  parseInt(t[1]);
    hour = hour + parseInt(task_hour_in);
    min = min + parseInt(task_min_in);

    /*helper function that updates total hours*/
    time_update(hour, min)
}

function edit(index){
    current_overlay = "add-task-overlay";
    id("add-task-overlay").style.display = "block";
    if (id("task-name").value == ""
        || id("task-priority").value == ""
        || id("task-hour").value == ""
        || id("task-min").value == ""){
        alert("Please Enter Required Fields");
    }
    else{
        let task = cn("task")[index];
        let task_name = id("task-name");
        let task_priority = id("task-priority")
        let task_hour = id("task-hour")
        let task_min = id("task-min")
        let task_name_parse = cn("task")[index].innerText;
        let text = task_name_parse.split(/\n/)
        task_name.placeholder = text[0];
        document.querySelectorAll("ul>li")
        task_priority.placeholder = task.querySelectorAll("ul>li")[0].innerText.split(": ");
        task_hour.placeholder = task.querySelectorAll("ul>li")[1].innerText.split(": ");
        task_min.placeholder = task.querySelectorAll("ul>li")[2].innerText.split(": ");
    }
}

function del(index){
    let task = cn("task")[index];
    let schedule = cn("task-schedule")[index];

    let time = id("time");
    let t =  time.innerText.split(":");
    let hour = parseInt(t[0]);
    let min =  parseInt(t[1]);

    let task_hour = parseInt(task.querySelectorAll("ul>li")[1].innerText.split(": ")[1]);
    let task_min = parseInt(task.querySelectorAll("ul>li")[2].innerText.split(": ")[1]);

    hour = hour - task_hour;
    min = min - task_min;

    /*helper function that updates total hours*/
    time_update(hour, min);

    task.remove();
    schedule.remove();
}

/*reveals pomodoro timer*/
function go_to_pom(){
    window.location.href = "Pomodoro/Pomodoro.html";
}

/*helper functions*/

function id(idName) {
    return document.getElementById(idName);
}

function cn(className) {
    return document.getElementsByClassName(className);
}

function close(idName){
    id(idName).style.display = "none";
}

/*helper function that updates total hours*/
function time_update(hour, min){
    if (min<10 & hour<10){
        time.innerText = "0" + hour + ":" + "0" + min;
    }
    else if (min>10 & hour<10){
        time.innerText = "0" + hour + ":" + min;
    }
    else if (mine<10 & hour>10){
        time.innerText = hour + ":" + "0" + min;
    }
    else{
        time.innerText = hour + ":" + min;
    }
}

/*Pomodoro timer code*/