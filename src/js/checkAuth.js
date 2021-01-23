const redirectOnUnauth = (redirect = '/') => {
	let authenticated = false;
	fetch('/api/checkAuth', {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(response => response.json())
		.then(data => {
			console.log(data);
			if (!data.authenticated) {
				window.location.href = redirect;
			}
		});
};

export default redirectOnUnauth;