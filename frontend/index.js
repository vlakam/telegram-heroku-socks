$(document).ready(function () {
    var currentProxy = null;
    var ipSpan = $('#ip');
    var portSpan = $('#port');
    var countrySpan = $('#country');
    var pingSpan = $('#ping');

    function updateProxy() {
        $.get('/proxy', null, function (data) {
            currentProxy = data;
            ipSpan.text(currentProxy.ipAddress);
            portSpan.text(currentProxy.port);
            countrySpan.text(currentProxy.country);
            pingSpan.text(currentProxy.ping);
        });
    }

    function toTelegram() {
        var win = window.open(`tg://socks?server=${currentProxy.ipAddress}&port=${currentProxy.port}`, '_blank');
        win.focus();
        setTimeout(() => {win.close();}, 1000);
    }

    updateProxy();

    $('#refresh').click(updateProxy);
    $('#telegram').click(toTelegram);
});