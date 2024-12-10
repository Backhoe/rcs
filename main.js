var go = function(){
    var cam = document.getElementById("cam").value;
    var mois = document.getElementById("mois").value;
    var jour = document.getElementById("jour").value;
    var heures = document.getElementById("heures").value;
    var minutes = document.getElementById("minutes").value;

    for(i=0;i<10; i++){
        if(minutes == i) minutes = "0"+i;
        if(jour == i) jour = "0"+i;
        if(heures == i) heures = "0"+i;
        if(mois == i) mois = "0"+i;
    }
    
    var date="2024_"+mois+"_"+jour+"_"+heures+"_"+minutes+"_";

    url="https://s3-eu-west-1.amazonaws.com/timelapsestorage/"+cam;
    var div=document.getElementById("imgContainer");

    div.innerHTML="<p>"+date+"</p>"
    for(i=0; i<10; i++){
        var a=document.createElement("a");
        if(i<10){
            var lienH = url+"/HIGH/"+date+"0"+i+".jpg";
            var lienL = url+"/LOW/"+date+"0"+i+".jpg";
        }
        else{
            var lienH = url+"/HIGH/"+date+i+".jpg";
            var lienL = url+"/LOW/"+date+i+".jpg";
        }
        a.href=lienH;
        a.target="_blank";
        a.innerHTML="<figure class='zoom' onmousemove='zoom(event)' style='background-image: url("+lienH+")'><img src='"+lienL+"'/></figure>";
        a.innerHTML+="<img src='"+lienL+"' style='height: 1px!important'/>";
        div.append(a);
    }

}

const now = new Date();
const month = now.getMonth() + 1;

let roundedMinutes;
roundedMinutes = Math.floor(now.getMinutes() / 5) * 5; // Palier automatique pour les autres cas

document.body.innerHTML=`<ul>
<li><label>Cam</label> <select id='cam'>
<option value="48043a4cf8b55d0019594df225f998b3">Tour</option>
<option value="a2cc7835d2d58445e6615efebe5bbeaf">Stade</option>
<option value="55a4eb940cb294f7cad1235a8e87b7bf">Sud</option>
</select></li>
<li><label>Mois</label> <input type='number' id='mois' min='1' max='12' value="${month}"></li>
<li><label>Jour</label> <input type='number' id='jour' min='0' max='31' value="${now.getDate()}"></li>
<li><label>Heures</label> <input type='number' id='heures' min='0' max='23' value="${now.getHours()}"></li>
<li><label>Minutes</label> <input type='number' id='minutes' min='0' max='59' value="${roundedMinutes}"></li>
<li><button onclick='go()'>Go</button></li>
</ul>
<div id="imgContainer"></div>
`

function zoom(e){
    var zoomer = e.currentTarget;
    e.offsetX ? offsetX = e.offsetX : offsetX = e.touches[0].pageX
    e.offsetY ? offsetY = e.offsetY : offsetX = e.touches[0].pageX
    x = offsetX/zoomer.offsetWidth*100
    y = offsetY/zoomer.offsetHeight*100
    zoomer.style.backgroundPosition = x + '% ' + y + '%';
  }

go();
