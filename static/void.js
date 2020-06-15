
var socket = io();

var id = undefined;

socket.on('connect', function() {
    socket.emit("register", function(newID) {
         id = newID;
        socket.on(id, function(message) {
            displayMessage(message);
        });
    });
});

var tts = undefined;


$(document).ready(function () {
    $("#editor").focus();
    $("#editor").click();

    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    msg.voice = voices[38]; // Note: some voices don't support altering params
    msg.voiceURI = 'native';
    msg.volume = 1; // 0 to 1
    msg.rate = 0.5; // 0.1 to 10
    msg.pitch = 0; //0 to 2
    msg.text = message;
    msg.lang = 'en-US';

    //tts = new SpeechSynthesisUtterance();
    // tts.default = false;
    // tts.volume = 1;
    // tts.rate = 0.1;
    // tts.pitch = 0;
    //tts.lang = "en-US";
});

$("#editor").on("blur", function () {
    $("#editor").focus();
});

document.getElementById("editor").addEventListener("input", function (event) {
    let editor = $("#editor");
    handleEdit(editor, function () {
        socket.emit("submit", {
            id: id,
            message: editor.text()
        });

        editor.animate(
            {
                opacity: 0
            },
            500,
            "swing",
            function () {
                editor.html("");
                editor.css("opacity", 1);
                editor.focus();
            }
        );
    });
});

function handleEdit(element, onEdit) {
    var content = element.html();
    if (content.includes("<br>")) {
        content = content.replace(/<br>/g, "");
        element.html(function () {
            return content;
        });
        element.blur();
        onEdit();
    }
}

function displayMessage(message) {
    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    msg.voice = voices[38]; // Note: some voices don't support altering params
    msg.voiceURI = 'native';
    msg.volume = 1; // 0 to 1
    msg.rate = 0.5; // 0.1 to 10
    msg.pitch = 0; //0 to 2
    msg.text = message;
    msg.lang = 'en-US';
    msg.onend = function(e) {
        messageElement.animate(
                    {opacity: 0},
                    800,
                    "swing",
                    function () {
                        messageElement.remove();
                    }
                )
    };
    window.speechSynthesis.speak(msg);

    var messageElement = $("<div>" + message + "</div>");
    messageElement.css("opacity", 0);
    $(".messages").append(messageElement);
    messageElement.animate(
        {opacity: 1},
        800,
        "swing",
        function () {}
    )
}
