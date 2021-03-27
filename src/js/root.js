import React from 'react';
import ReactDOM from 'react-dom';
import RootApp from './components/RootApp.jsx';

// Stop animations on window resize
let resizeTimer;
window.addEventListener("resize", () => {
  document.body.classList.add("resize-animation-stopper");
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    document.body.classList.remove("resize-animation-stopper");
  }, 400);
});

ReactDOM.render(<RootApp />, document.getElementById('app'));
