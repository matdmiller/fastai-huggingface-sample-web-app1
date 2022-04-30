console.log('app.js loaded...')

//Drop Area Handling
let dropArea = document.getElementById('drop-area');

//Allow for drag/drop handling
function preventDefaults (e) {
    e.preventDefault();
    e.stopPropagation();
}
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
});
  
//Handle Highlight / Unhighlight Drop Area
['dragenter', 'dragover'].forEach(eventName => {dropArea.addEventListener(eventName, highlight, false);});
['dragleave', 'drop'].forEach(eventName => {dropArea.addEventListener(eventName, unhighlight, false);});
function highlight(e) {dropArea.classList.add('highlight');}
function unhighlight(e) {dropArea.classList.remove('highlight');}

//Handle Image Drop
dropArea.addEventListener('drop', handleDrop, false);
function handleDrop(e) {
  let dt = e.dataTransfer;
  let files = dt.files;
  handleFiles(files);
}

async function handleFiles(files) {
    //Timeout Version: timout should not be needed, but was getting lots of 500 errors w/o it when calling api for multiple imgs.
    let i = 0;
    for (let file of files) {
        await setTimeout(function(){ 
            uploadFile(file);
        }, i);
        i += 300;
    }
    //Version w/o timout.  Getting lots of 500 api errors when multiple images uploaded.
    // ([...files]).forEach(await uploadFile);
}

async function uploadFile(file) {
    let url = 'https://hf.space/embed/jph00/testing/+/api/predict/'
    let reader = new FileReader()
    reader.readAsDataURL(file);
    reader.onloadend = function() {
        data = JSON.stringify({"data":[ reader.result ]})
        post = { method: "POST", body: data, headers: { "Content-Type": "application/json" } }
        fetch(url, post)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            let imgdiv = document.createElement('div');
            let img = document.createElement('img');
            img.src = reader.result;
            imgdiv.appendChild(img);
            imgdiv.appendChild(document.createElement('br'))
            let preds = data.data[0].confidences;
            preds.sort((a,b) => b.confidence - a.confidence);
            let i = 0;
            for (const pred of preds) {
                if (i < 5) {
                    let confidenceBar = document.createElement('progress');
                    confidenceBar.max = 1;
                    confidenceBar.value = pred.confidence;
                    imgdiv.append(pred.label+' ');
                    imgdiv.appendChild(confidenceBar);
                    imgdiv.appendChild(document.createElement('br'))
                    i += 1;
                }
            }
            document.getElementById('gallery').appendChild(imgdiv);
        })
        .catch((e) => { 
            console.log('API Error: ');
            console.log(e);
            let imgdiv = document.createElement('div');
            let img = document.createElement('img');
            img.src = reader.result;
            imgdiv.appendChild(img);
            imgdiv.appendChild(document.createElement('br'));
            imgdiv.append('API Error');
            document.getElementById('gallery').appendChild(imgdiv);
        })
        return;
      }
  }

function executeSearch() {
    console.log('Search executing...');
    let searchTerm = document.getElementById('search-input-box').value;
    let searchUrl = 'https://www.google.com/search?q='+encodeURIComponent('site:docs.fast.ai '+searchTerm);
    console.log(searchTerm);
    // window.location.href = searchUrl;
    // location.replace(searchUrl);
    window.open(searchUrl);
}
