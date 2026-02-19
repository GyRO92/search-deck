export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

  const PLAYLIST_ID = '4VJIBPWs8k49fofjJiRhLc';
  const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return res.status(500).json({ error: 'Spotify credentials not configured' });
  }

  try {
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
      },
      body: 'grant_type=client_credentials'
    });

    if (!tokenRes.ok) {
      const errBody = await tokenRes.text();
      return res.status(500).json({ error: 'Token request failed', status: tokenRes.status, detail: errBody });
    }

    const tokenData = await tokenRes.json();

    const playlistRes = await fetch(
      `https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/tracks?limit=100`,
      { headers: { 'Authorization': 'Bearer ' + tokenData.access_token } }
    );

    if (!playlistRes.ok) {
      const errBody = await playlistRes.text();
      return res.status(500).json({ error: 'Playlist fetch failed', status: playlistRes.status, detail: errBody });
    }

    const playlistData = await playlistRes.json();

    const tracks = playlistData.items
      .filter(item => item.track)
      .map(item => ({
        id: item.track.id,
        name: item.track.name,
        artists: item.track.artists.map(a => a.name).join(', '),
        artwork: item.track.album.images && item.track.album.images.length
          ? item.track.album.images[item.track.album.images.length > 1 ? 1 : 0].url
          : null,
        spotifyUrl: item.track.external_urls.spotify,
        durationMs: item.track.duration_ms
      }));

    return res.status(200).json({ tracks });

  } catch (err) {
    return res.status(500).json({ error: 'Server error', detail: err.message });
  }
}
