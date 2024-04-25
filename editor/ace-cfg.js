var editor = ace.edit("editor");

let langTools = ace.require("ace/ext/language_tools");
editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
});

editor.setTheme("ace/theme/tomorrow_night_eighties");
editor.session.setMode("ace/mode/javascript");

var gearWorksMethodCompleter = {
    getCompletions: function(editor, session, pos, prefix, callback) {
        var wordList = Object.keys(gearWorks);
        callback(null, wordList.map(function(word) {
            return {
                caption: word,
                value: word,
                meta: "method"
            };
        }));
    }
};

var objNameCompleter = {
    getCompletions: function(editor, session, pos, prefix, callback) {
        var wordList = ["gearWorks", "draw"];
        callback(null, wordList.map(function(word) {
            return {
                caption: word,
                value: word,
                meta: "object"
            };
        }));
    }
};

langTools.addCompleter(gearWorksMethodCompleter);
langTools.addCompleter(objNameCompleter);
