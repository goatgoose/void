var socket = io();

socket.on('connect', function () {
    if (window.localStorage.getItem("id") == null) {
        socket.emit("register", function (id) {
            window.localStorage.setItem("id", id);
            socket.on(id, function (message) {
                handleMessage(message);
            });
        });
    } else {
        var id = window.localStorage.getItem("id");
        socket.on(id, function (message) {
            handleMessage(message);
        });
    }
});

var tts = undefined;


$(document).ready(function () {
    $("#editor").focus();
    $("#editor").click();

    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    msg.voice = voices[38];
    msg.voiceURI = 'native';
    msg.lang = 'en-US';
});

$("#editor").on("blur", function () {
    $("#editor").focus();
});

document.getElementById("editor").addEventListener("input", function (event) {
    let editor = $("#editor");
    handleEdit(editor, function () {
        socket.emit("submit", {
            id: window.localStorage.getItem("id"),
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

function handleMessage(message) {
    if (message.startsWith("http://") || message.startsWith("https://")) {
        var messageElement = $("<a href='" + message.split(" ")[0] + "' target='_blank'>" + message + "</a><br>");
        displayElement(messageElement, function () {
            setTimeout(function () {
                messageElement.animate(
                    {opacity: 0},
                    800,
                    "swing",
                    function () {
                        messageElement.remove();
                    }
                )
            }, 1500);
        });
    } else {

        var messageElement = $("<div>" + message + "</div>");
        speakMessage(message, messageElement);
        displayElement(messageElement);
    }
}

function speakMessage(message, messageElement) {
    var msg = new SpeechSynthesisUtterance();
    var voices = window.speechSynthesis.getVoices();
    msg.voice = voices[38];
    msg.voiceURI = 'native';
    msg.volume = 1; // 0 to 1
    msg.rate = 0.5; // 0.1 to 10
    msg.pitch = 0; // 0 to 2
    msg.text = message;
    msg.lang = 'en-US';
    msg.onend = function (e) {
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
}

function displayElement(messageElement, callback) {
    messageElement.css("opacity", 0);
    $(".messages").append(messageElement);
    messageElement.animate(
        {opacity: 1},
        800,
        "swing",
        function () {
            if (callback !== undefined) {
                callback();
            }
        }
    )
}
