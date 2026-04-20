const now = new Date();
const localISOTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);

document.body.innerHTML = `
    <ul class="menu">
        <li><label>Vues</label> 
            <button onclick='switchClass("vue1")'>1</button>
            <button onclick='switchClass("vue2")'>2</button>
            <button onclick='switchClass("vue3")'>3</button>
        </li>
        <li><label>Date</label> <input type='datetime-local' id='datetime-local' value="${localISOTime}"></li>
        <li><button onclick='go()' id="btn-go">Actualiser</button></li>
    </ul>
    <div class="flex imgsContainer vue1"></div>
`;

const checkImage = (src) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = src;
    });
};

const pad = (n) => String(n).padStart(2, '0');

const go = async () => {
    const val = document.getElementById('datetime-local').value;
    if (!val) return;

    const baseDate = new Date(val);
    const container = document.querySelector(".imgsContainer");
    
    const currentVue = Array.from(container.classList).find(c => c.startsWith('vue')) || 'vue1';
    container.className = `imgsContainer ${currentVue}`; 
    container.innerHTML = ""; 

    const ids = ["48043a4cf8b55d0019594df225f998b3", "a2cc7835d2d58445e6615efebe5bbeaf", "55a4eb940cb294f7cad1235a8e87b7bf"];
    const root = "https://s3-eu-west-1.amazonaws.com/timelapsestorage/";
    
    const SECONDS_RANGE = 10; 
    const MAX_PALIERS = 12;  

    ids.forEach(async (id) => {
        const camWrapper = document.createElement("div");
        camWrapper.className = "cam-wrapper"; 
        
        const statusEl = document.createElement("div");
        statusEl.className = "search-status";
        camWrapper.appendChild(statusEl);
        container.appendChild(camWrapper);
        
        let found = false;

        for (let p = 0; p < MAX_PALIERS; p++) {
            const datePalier = new Date(baseDate.getTime() - (p * 5 * 60000));
            const minsPalier = Math.floor(datePalier.getMinutes() / 5) * 5;
            const folder = `${datePalier.getFullYear()}_${pad(datePalier.getMonth() + 1)}_${pad(datePalier.getDate())}_${pad(datePalier.getHours())}_${pad(minsPalier)}_`;

            for (let s = 0; s < SECONDS_RANGE; s++) {
                const suffix = pad(s);
                statusEl.innerHTML = `Scan ${pad(datePalier.getHours())}:${pad(minsPalier)}<br><small>(:${suffix}s)</small>`;
                
                const urlLow = `${root}${id}/LOW/${folder}${suffix}.jpg`;
                const urlHigh = `${root}${id}/HIGH/${folder}${suffix}.jpg`;
                
                const exists = await checkImage(urlLow);

                if (exists) {
                    camWrapper.innerHTML = `
                        <a href="${urlHigh}" target="_blank">
                            <figure class='zoom' onmousemove='zoom(event)' style='background-image: url(${urlLow})'>
                                <img src='${urlLow}' class="img-webcam" alt="Webcam" />
                                <div class="timestamp">
                                    ${pad(datePalier.getHours())}:${pad(minsPalier)}:${suffix} 
                                    ${p > 0 ? `(-${p*5}min)` : ''}
                                </div>
                            </figure>
                        </a>`;

                    const imgHigh = new Image();
                    imgHigh.src = urlHigh;
                    imgHigh.onload = () => {
                        const figure = camWrapper.querySelector('figure');
                        const imgTag = camWrapper.querySelector('.img-webcam');
                        if (figure && imgTag) {
                            figure.style.backgroundImage = `url(${urlHigh})`;
                            imgTag.src = urlHigh;
                        }
                    };

                    found = true;
                    break; 
                }
            }
            if (found) break;
        }

        if (!found) {
            camWrapper.innerHTML = `<div class="cam-error">Caméra hors ligne<br><small>(pas d'image depuis 1h)</small></div>`;
        }
    });
};

const zoom = (e) => {
    const zoomer = e.currentTarget;
    const rect = zoomer.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    zoomer.style.backgroundPosition = `${x}% ${y}%`;
};

const switchClass = (className) => {
    const container = document.querySelector('.imgsContainer');
    if (container) container.className = `imgsContainer ${className}`;
};

go();
