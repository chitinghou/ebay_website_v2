const axios = require('axios');

class OAuthToken {
  constructor(client_id, client_secret) {
    this.client_id = client_id;
    this.client_secret = client_secret;
  }

  async getApplicationToken() {
    const url = 'https://api.ebay.com/identity/v1/oauth2/token';

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${this.getBase64Encoding()}`,
    };

    const data = new URLSearchParams();
    data.append('grant_type', 'client_credentials');
    data.append('scope', 'https://api.ebay.com/oauth/api_scope');

    try {
      const response = await axios.post(url, data, { headers });
      return response.data.access_token;
    } catch (error) {
      console.error('Error obtaining access token:', error);
      throw error;
    }
  }

  getBase64Encoding() {
    const credentials = `${this.client_id}:${this.client_secret}`;
    const buffer = Buffer.from(credentials, 'utf-8');
    return buffer.toString('base64');
  }
}

module.exports = OAuthToken;
