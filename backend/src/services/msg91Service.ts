import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const MSG91_AUTH_KEY = process.env.MSG91_AUTH_KEY;
const MSG91_TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID;

class MSG91Service {
  /**
   * Send an OTP using MSG91
   * @param phoneNumber The 10-digit mobile number (can include country code e.g., 91XXXXXXXXXX)
   * @param otp The 6-digit OTP
   */
  static async sendOTP(phoneNumber: string, otp: string) {
    // If keys are not configured, skip calling the real API (useful for local development)
    if (!MSG91_AUTH_KEY || !MSG91_TEMPLATE_ID) {
      console.warn('MSG91_AUTH_KEY or MSG91_TEMPLATE_ID not configured. Skipping real SMS dispatch.');
      return { type: 'success', message: 'Mock dispatch successful' };
    }

    try {
      // Ensure phone number has country code (assuming India 91 if length is 10)
      let mobile = phoneNumber.replace(/[^0-9]/g, '');
      if (mobile.length === 10) {
        mobile = `91${mobile}`;
      }

      // MSG91 SendOTP API Endpoint (v5)
      // GET request format: https://control.msg91.com/api/v5/otp?template_id=&mobile=&authkey=&otp=
      // But POST is also supported. We'll use POST.
      const response = await axios.post(
        'https://control.msg91.com/api/v5/otp',
        {
          template_id: MSG91_TEMPLATE_ID,
          mobile: mobile,
          otp: otp
        },
        {
          headers: {
            authkey: MSG91_AUTH_KEY,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Failed to send MSG91 OTP:', error);
      throw error;
    }
  }
}

export default MSG91Service;
