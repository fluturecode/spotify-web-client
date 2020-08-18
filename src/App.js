import React, { useEffect } from "react";
import { useStateValue } from "./stateProvider";
import Player from "./Components/Player";
import { getTokenFromUrl } from "./spotify";
import "./App.css";
import Login from "./Components/Login";
//Allows React to work with Spotify API
import SpotifyWebApi from "spotify-web-api-js";

const s = new SpotifyWebApi();

function App() {
	const [{ token }, dispatch] = useStateValue(null);

	useEffect(() => {
		// Set token
		const hash = getTokenFromUrl();
		window.location.hash = "";
		const _token = hash.access_token;

		if (_token) {
			s.setAccessToken(_token);

			dispatch({
				type: "SET_TOKEN",
				token: _token,
			});

			s.getPlaylist().then((response) =>
				dispatch({
					type: "SET_DISCOVER_WEEKLY",
					discover_weekly: response,
				})
			);

			s.getMyTopArtists().then((response) =>
				dispatch({
					type: "SET_TOP_ARTISTS",
					top_artists: response,
				})
			);

			dispatch({
				type: "SET_SPOTIFY",
				spotify: s,
			});

			s.getMe().then((user) => {
				dispatch({
					type: "SET_USER",
					user,
				});
			});

			s.getUserPlaylists().then((playlists) => {
				dispatch({
					type: "SET_PLAYLISTS",
					playlists,
				});
			});
		}
	}, [token, dispatch]);

	return (
		<div className="app">
			{!token && <Login />}
			{token && <Player spotify={s} />}
		</div>
	);
}

export default App;
