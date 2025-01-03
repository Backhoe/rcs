var go = function(){

    var cam = document.getElementById("cam").value;
    const datetimeLocal = document.getElementById('datetime-local').value;
    const date = new Date(datetimeLocal);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Les month commencent à 0
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(Math.floor(now.getMinutes() / 5) * 5).padStart(2, '0');
    
    var laDate=year+"_"+month+"_"+day+"_"+hours+"_"+minutes+"_";

    url="https://s3-eu-west-1.amazonaws.com/timelapsestorage/"+cam;
    var div=document.getElementById("imgContainer");

    div.innerHTML="<p>"+laDate+"</p>"
    for(i=0; i<10; i++){
        var a=document.createElement("a");
        if(i<10){
            var lienH = url+"/HIGH/"+laDate+"0"+i+".jpg";
            var lienL = url+"/LOW/"+laDate+"0"+i+".jpg";
        }
        else{
            var lienH = url+"/HIGH/"+laDate+i+".jpg";
            var lienL = url+"/LOW/"+laDate+i+".jpg";
        }
        a.href=lienH;
        a.target="_blank";
        a.innerHTML="<figure class='zoom' onmousemove='zoom(event)' style='background-image: url("+lienH+")'><img src='"+lienL+"'/></figure>";
        a.innerHTML+="<img src='"+lienL+"' style='height: 1px!important'/>";
        div.append(a);
    }

}

const now = new Date();
document.body.innerHTML=`<ul>
<li><label>Cam</label> <select id='cam'>
<option value="48043a4cf8b55d0019594df225f998b3">Tour</option>
<option value="a2cc7835d2d58445e6615efebe5bbeaf">Stade</option>
<option value="55a4eb940cb294f7cad1235a8e87b7bf">Sud</option>
</select></li>
<li><label>Date et Heure</label> <input type='datetime-local' id='datetime-local' value="${now.toISOString().slice(0,16)}" step="300"></li>
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
