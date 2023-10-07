const { ipcRenderer } = require('electron');
const Store = require('electron-store');
const fs = require('fs');

const store = new Store();

document.getElementById('open').addEventListener('click', () => {
  ipcRenderer.send('open-folder-dialog');
});

document.getElementById('safe').addEventListener('click', () => {
    let fln = window.document.querySelector('#fileName');
    let textarea = window.document.querySelector('textarea');
    const filePath = `${store.get('selectedDirectory')}\\${fln.textContent}`;
    fs.writeFileSync(filePath, textarea.value);
});

document.getElementById('reload').addEventListener('click', () => {
    const filePath = store.get('selectedDirectory');
    const files = fs.readdirSync(filePath).filter(file => file.endsWith('.txt'));
    const divO = document.getElementById('filesDiv');
    if (divO) {
        divO.innerHTML = '';
        for (const file of files) {
            let div = document.createElement('div');
            let p = document.createElement('p');
            p.innerText = file;
            div.className = 'files';
            div.appendChild(p);
            divO.appendChild(div);
        }
    }
})

document.getElementById('filesDiv').addEventListener('click', (event) => {
    if (event.target.nodeName == 'P') {
        let fln = window.document.querySelector('#fileName');
        if (event.target.textContent == fln.textContent) { return; }
        fln.innerHTML = event.target.textContent;
        let textarea = window.document.querySelector('textarea');
        const txt = fs.readFileSync(`${store.get('selectedDirectory')}/${event.target.textContent}`, 'utf-8');
        textarea.value = txt;
    }
});

ipcRenderer.on('selected-directory', (event, path) => {
    let fln = window.document.querySelector('#fileName');
    fln.innerHTML = 'default.txt';
    const files = fs.readdirSync(path).filter(file => file.endsWith('.txt'));
    const divO = document.getElementById('filesDiv');
    if (divO) { 
        divO.innerHTML = '';
        for (const file of files) {
            let div = document.createElement('div');
            let p = document.createElement('p');
            p.innerText = file;
            div.className = 'files';
            div.appendChild(p);
            divO.appendChild(div);
            window.document.querySelector('#left-panel').appendChild(divO);
        }
        store.set('selectedDirectory', path);
    }
    
    else {
        let divO = document.createElement('div');
        for (const file of files) {
          let div = document.createElement('div');
          let p = document.createElement('p');
          p.innerText = file;
          div.className = 'files';
          div.appendChild(p);
          divO.id = 'filesDiv';
          divO.appendChild(div);
          window.document.querySelector('#left-panel').appendChild(divO);
        }
        store.set('selectedDirectory', path);
    }
});


