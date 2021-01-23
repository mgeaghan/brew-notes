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

ReactDOM.render(<ReactApp />, document.getElementById('app'));
