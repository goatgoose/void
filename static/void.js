
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


$(document).ready(function () {
    $("#editor").focus();
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
    var messageElement = $("<div>" + message + "</div>");
    messageElement.css("opacity", 0);
    $(".messages").append(messageElement);
    messageElement.animate(
        {opacity: 1},
        800,
        "swing",
        function () {
            setTimeout(function () {
                messageElement.animate(
                    {opacity: 0},
                    800,
                    "swing",
                    function () {
                        messageElement.remove();
                    }
                )
            }, 2000);
        }
    )
}
