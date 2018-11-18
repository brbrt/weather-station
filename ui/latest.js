window.addEventListener('load', init);

var readingTemplate;

function init() {
    loadData();
    readingTemplate = compileTemplate();
}

function compileTemplate() {
    var source = document.getElementById("reading-template").innerHTML;
    return Handlebars.compile(source);
}

function loadData() {
    fetch('/api/weather/latest')
        .then(resp => resp.json())
        .then(formatData)
        .then(displayData)
        .catch(err => console.log('Error loading data', err));

}

function formatData(sensors) {
    return sensors.map(s => {
        s.time = new Date(Date.parse(s.time)).toLocaleTimeString('hu-HU');
        return s;
    });
}

function displayData(sensors) {
    console.log('Latest data: ', sensors);

    const html = readingTemplate({sensors: sensors});
    document.querySelector('.content').innerHTML = html;
}
