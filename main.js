var go = function() {
    const datetimeLocal = document.getElementById('datetime-local').value;
    const date = new Date(datetimeLocal);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Les mois commencent à 0
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(Math.floor(date.getMinutes() / 5) * 5).padStart(2, '0');
    
    var laDate = year + "_" + month + "_" + day + "_" + hours + "_" + minutes + "_";
    console.log(laDate);    

    url = "https://s3-eu-west-1.amazonaws.com/timelapsestorage/";
    var divs = document.querySelectorAll(".imgContainer");
    divs.forEach(function(div) {
        var cam = div.id;
        for (i = 5; i < 10; i++) {
            var a = document.createElement("a");
            if (i < 10) {
                var lienH = url + cam + "/HIGH/" + laDate + "0" + i + ".jpg";
                var lienL = url + cam + "/LOW/" + laDate + "0" + i + ".jpg";
            } else {
                var lienH = url + cam + "/HIGH/" + laDate + i + ".jpg";
                var lienL = url + cam + "/LOW/" + laDate + i + ".jpg";
            }
            a.href = lienH;
            a.target = "_blank";
            a.innerHTML = "<figure class='zoom' onmousemove='zoom(event)' style='background-image: url(" + lienH + ")'><img src='" + lienL + "' onerror='this.parentElement.style.display=\"none\"'/></figure>";
            a.innerHTML += "<img src='" + lienL + "' style='height: 1px!important' onerror='this.style.display=\"none\"'/>";
            div.append(a);
        }
    });
}

const now = new Date();
document.body.innerHTML = `<ul>
<li><label>Date et Heure</label> <input type='datetime-local' id='datetime-local' value="${now.toISOString().slice(0,16)}" step="300"></li>
<li><button onclick='go()'>Go</button></li>
</ul>
<div class="imgContainer" id="48043a4cf8b55d0019594df225f998b3"></div>
<div class="imgContainer" id="a2cc7835d2d58445e6615efebe5bbeaf"></div>
<div class="imgContainer" id="55a4eb940cb294f7cad1235a8e87b7bf"></div>
`

function zoom(e) {
    var zoomer = e.currentTarget;
    e.offsetX ? offsetX = e.offsetX : offsetX = e.touches[0].pageX
    e.offsetY ? offsetY = e.offsetY : offsetX = e.touches[0].pageX
    x = offsetX / zoomer.offsetWidth * 100
    y = offsetY / zoomer.offsetHeight * 100
    zoomer.style.backgroundPosition = x + '% ' + y + '%';
}

go();
