(function () {
  'use strict';
  var ref = rootRef;
  var firepadRef = getRef();
  var editor = ace.edit("firepad-container")
  editor.setTheme("../scripts/ace/theme/monokai");
  let session = editor.getSession();
  session.setUseWrapMode(true);
  session.setUseWorker(false);
  session.setMode("../scripts/ace/mode/javascript");
  // Create CodeMirror (with lineWrapping on).
  // Create a random ID to use as our user ID (we must give this to firepad and FirepadUserList).
  let userId = Math.floor(Math.random() * 9999999999).toString();
  // Create Firepad (with rich text features and our desired userId).
  var firepad = Firepad.fromACE(firepadRef, editor, {userId: userId});
  // Create FirepadUserList (with our desired userId).
  var firepadUserList = FirepadUserList.fromDiv(firepadRef.child('users'), document.getElementById('userlist'), userId);
  //// Initialize contents.
  firepad.on('ready', function () {
    if (firepad.isHistoryEmpty()) {
      firepad.setText('// JavaScript Editing with Firepad!\nfunction go() {\n  var message = "Hello, world.";\n  console.log(message);\n}');
    }
  });
})();
