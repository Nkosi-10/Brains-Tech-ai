export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get API key from environment variables
  const API_KEY = process.env.GOOGLE_API_KEY;
  
  if (!API_KEY) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const { contents } = req.body;
    
    if (!contents) {
      return res.status(400).json({ error: 'Contents are required' });
    }

    // Make request to Google Gemini API
    const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents
      })
    });

    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      return res.status(response.status).json({ 
        error: `API request failed: ${response.status} ${response.statusText}` 
      });
    }

    // Check if response has content before parsing
    const responseText = await response.text();
    if (!responseText) {
      return res.status(500).json({ error: 'Empty response from API' });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Response Text:', responseText);
      return res.status(500).json({ error: 'Invalid JSON response from API' });
    }

    // Validate response structure
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Invalid response structure:', data);
      return res.status(500).json({ error: 'Invalid response structure from API' });
    }

    // Return the response data
    res.status(200).json(data);

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
}
