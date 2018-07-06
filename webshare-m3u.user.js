// ==UserScript==
// @name         WebShare M3U play
// @version      0.1
// @author       me@martinfranc.eu
// @match        https://webshare.cz/*
// @grant        none
// @run-at       document-end
// ==/UserScript==


(function() {
    function isFileDetail() {
        var url = window.location.href;
        const regex = /^https:\/\/webshare\.cz\/#\/file\//g;

        return (url.match(regex) !== null);
    }
  
    let removeElements = elms => Array.from(elms).forEach(el => el.remove());

    function addFileDetailButton() {
        removeElements(document.querySelectorAll(".francma"));
        var btn = document.createElement("A");
        btn.classList.add('ws-big-button', 'green', 'ws-radius-3', 'ws-left', 'francma');
        btn.appendChild(document.createTextNode('M3U'));

        var client = new ws.ApiClient();
        client.call('file_link', { ident: ws.WFileDetailSection.fileIdent(), password: ws.WFileDetailSection.passwordDigest })
            .done().connect(this, function(response) {
            btn.href = 'data:audio/x-mpegurl;charset=UTF-8,%23EXTM3U%0A%0A' + response.link + '%0A';
            btn.download = 'file.m3u';
        });

        var parent = document.getElementsByClassName('ws-control-panel')[0];
        parent.insertBefore(btn, parent.firstChild);
    }

    var fn = function() {
        if(isFileDetail()) {
            addFileDetailButton();
        }
    };

    window.onhashchange = fn;

    nIntervId = setInterval(function() {
        var el = document.getElementsByClassName('ws-control-panel')[0];
        if(el) {
            fn();
            clearInterval(nIntervId);
        }

    }, 100);
})();

