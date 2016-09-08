'use strict';
function getRef() {

  var ref = new Firebase('https://coedit-4b1b9.firebaseio.com');
  var hash = window.location.hash.replace(/#/g, '');
  if (hash) {
    ref = ref.child(hash);
  } else {
    ref = ref.push(); // generate unique location.
    // window.location = window.location + '#' + ref.name(); // add it as a hash to the URL.
  }

  if (typeof console !== 'undefined') console.log('Firebase data: ', ref.toString());

  console.log(ref);
  return ref;
}
