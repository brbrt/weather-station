angular
    .module('weatherStation.history.colorSrv', [
    ])
    .factory('colorSrv', colorSrv);

function colorSrv() {
    var colorPalette = [
        'rgb(255, 0, 0)',
        'rgb(0, 250, 0)',
        'rgb(30, 60, 210)',
        'rgb(0, 217, 217)',
        'rgb(254, 0, 254)',
        'rgb(254, 126, 79)',
        'rgb(66, 115, 39)',
        'rgb(13, 132, 255)',
        'rgb(128, 0, 64)',
        'rgb(117, 56, 159)'
    ];

    return {
        getColors: getColors
    };

    ///////////////////

    function getColors(count) {
        return colorPalette.slice(0, count);
    }

}


