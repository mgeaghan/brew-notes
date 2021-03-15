import React from 'react';
import ReactDOM from 'react-dom';
import ReactApp from './components/ReactApp.jsx';

// Force refresh on history traversal
window.addEventListener( "pageshow", (event) => {
	let perfEntries = performance.getEntriesByType("navigation");
	if (perfEntries[0].type === "back_forward") {
		window.location.reload();
	}
});

// Stop animations on window resize
let resizeTimer;
window.addEventListener("resize", () => {
  document.body.classList.add("resize-animation-stopper");
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    document.body.classList.remove("resize-animation-stopper");
  }, 400);
});

ReactDOM.render(<ReactApp />, document.getElementById('app'));
