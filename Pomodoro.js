
    window.addEventListener("load", init);
    let timerID = null;
    let pom_timer = "25:00";
    let short_timer = "5:00";
    let long_timer = "15:00";
    let pom_counter = 0;
    let pom_total = 0;
    let short_counter = 0;
    let short_total = 0;
    let long_counter = 0;
    let long_total = 0;


    function init(){
        id("Start").addEventListener("click", start);
        id("setting-btn").addEventListener("click", setting);
        id("close").addEventListener("click", close)
        id("overlay").addEventListener("click", close_overlay);
        timer_btn();
        stat_btn();
    }

    function start(){
        if (id("Start").innerText === "Start"){
            timer();
            id("Start").innerText = "Pause"
        }
        else{
            id("Start").innerText = "Start"
            clearInterval(timerID);
        }
    }

    function timer(){
        let act = cn("btn-active");
        let btn = cn("btn");
        let str = id("timer").innerText;
        let str_split = str.split(":");
        let m = parseInt(str_split[0]);
        let s = parseInt(str_split[1]);
        let time = m *60 + s;
        timerID = setInterval(function () {
            if (time === 0) {
                id("timer").innerText = "00:00";
                clearInterval(timerID);
                if (act[0].innerText === "Pomodoro"){
                    pom_counter++;
                    pom_total += 25;
                    if (pom_counter%4 !== 0){
                        btn[1].classList.toggle("btn-active");
                        act[0].classList.toggle("btn-active");
                        document.querySelector("body").className = "short"
                        id("timer").innerText = short_timer;
                        id("Start").innerText = "Start";

                    }
                    else{
                        btn[2].classList.toggle("btn-active");
                        act[0].classList.toggle("btn-active");
                        document.querySelector("body").className = "long"
                        id("timer").innerText = long_timer;
                        id("Start").innerText = "Start";

                    }
                }
                else if (act[0].innerText === "Short Break"){
                    short_counter++;
                    short_total += 5;
                    btn[0].classList.toggle("btn-active");
                    act[1].classList.toggle("btn-active");
                    document.querySelector("body").className = "pom"
                    id("timer").innerText = pom_timer;
                    id("Start").innerText = "Start";

                }
                else{
                    long_counter++;
                    long_total += 15;
                    btn[0].classList.toggle("btn-active");
                    act[1].classList.toggle("btn-active");
                    document.querySelector("body").className = "pom"
                    id("timer").innerText = pom_timer;
                    id("Start").innerText = "Start";

                }
            }
            else {
                let min = Math.floor(time / 60);
                let sec = time - min * 60;
                id("timer").innerText = min + ":" + sec;
                time--;
            }
        }, 1000);

    }

    function btn_change(){
        let act = cn("btn-active");
        if (act.length===1){
            act[0].classList.toggle("btn-active");
        }
    }

    function timer_btn(){
        let btn = cn("btn");
        for ( let i = 0; i < btn.length; i++){
            btn[i].addEventListener("click", function (){
                clearInterval(timerID);
                btn_change();
                btn[i].classList.toggle("btn-active");
                if (btn[i].innerText === "Pomodoro"){
                    id("timer").innerText = pom_timer;
                    document.querySelector("body").className = "pom";

                }
                else if(btn[i].innerText === "Short Break"){
                    id("timer").innerText = short_timer;
                    document.querySelector("body").className = "short";
                }
                else{
                    id("timer").innerText = long_timer;
                    document.querySelector("body").className = "long";
                }
            });
        }
    }

    function setting(){
        id("setting").style.display = "block";
    }

    function close(){
        set_time();
        id("setting").style.display = "none";
    }

    function set_time(){
        pom_timer = (id("pom-s").value).toString() + ":00";
        short_timer = (id("short-s").value).toString() + ":00";
        long_timer = (id("long-s").value).toString() + ":00";
        let act = cn("btn-active")
        if (act[0].innerText === "Pomodoro"){
            id("timer").innerText = pom_timer;
        }
        else if (act[0].innerText === "Short Break"){
            id("timer").innerText = short_timer;
        }
        else{
            id("timer").innerText = long_timer;
        }
    }

    function stat_btn(){
        let stat = cn("nav-btn");
        let over = id("overlay");
        for (let i = 0; i<stat.length-1; i++){
            stat[i].addEventListener("click", function () {
                over.style.display = "block";
                let text_o = document.createElement("div");
                text_o.id = "text-o";
                over.appendChild(text_o);

                let p_c = document.createElement("P");
                let p_t = document.createElement("P");
                p_c.innerText = "Counter: ";
                p_t.innerText = "Total Time: "
                let span_c = document.createElement("span");
                let span_t = document.createElement("span");
                let br = document.createElement("br");
                p_c.appendChild(span_c);
                p_t.appendChild(span_t);
                p_c.appendChild(br);

                text_o.appendChild(p_c);
                text_o.appendChild(p_t);

                if (stat[i].innerText === "Pom Stats") {
                    let p_hour = Math.floor(pom_total / 60).toString();
                    let p_min = (pom_total - p_hour * 60).toString();
                    span_c.innerText = pom_counter.toString();
                    span_t.innerText = p_hour + ":" + p_min + ":" + "00";
                } else if (stat[i].innerText === "Short Break Stats") {
                    let p_hour = Math.floor(short_total / 60).toString();
                    let p_min = (short_total - p_hour * 60).toString();
                    span_c.innerText = short_counter.toString();
                    span_t.innerText = p_hour + ":" + p_min + ":" + "00";
                } else {
                    let p_hour = Math.floor(long_total / 60).toString();
                    let p_min = (long_total - p_hour * 60).toString();
                    span_c.innerText = long_counter.toString();
                    span_t.innerText = p_hour + ":" + p_min + ":" + "00";
                }
            })
        }
    }

/*    function overlay(){
        let counter = cn("counter");
        let total_time = cn("total_time");
        counter[0].innerText = pom_counter;
        counter[1].innerText = short_counter;
        counter[2].innerText = long_counter;

        let p_hour = Math.floor(pom_total/60).toString();
        let p_min = (pom_total - p_hour*60).toString();

        let s_hour = Math.floor(short_total/60).toString();
        let s_min = (short_total - s_hour*60).toString();

        let l_hour = Math.floor(long_total/60).toString();
        let l_min = (long_total - l_hour*60).toString();

        total_time[0].innerText = p_hour + ":" + p_min + ":" + "00";
        total_time[1].innerText = s_hour + ":" + s_min + ":" + "00";
        total_time[2].innerText = l_hour + ":" + l_min + ":" + "00";
    }*/

    function close_overlay(){
        id("overlay").style.display ="none";
    }


    function id(idName) {
        return document.getElementById(idName);
    }

    function cn(className) {
        return document.getElementsByClassName(className);
    }

    function q(element){
        return document.querySelector(element);
    }
