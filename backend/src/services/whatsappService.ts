import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const WA_API_URL = process.env.WA_API_URL || 'https://graph.facebook.com/v17.0';
const WA_PHONE_NUMBER_ID = process.env.WA_PHONE_NUMBER_ID || 'your_phone_number_id';
const WA_ACCESS_TOKEN = process.env.WA_ACCESS_TOKEN || 'your_access_token';

/**
 * Service to interact with Meta Direct WhatsApp API
 */
class WhatsAppService {
  /**
   * Send an OTP authentication template message
   */
  static async sendOTP(phoneNumber: string, otp: string) {
    try {
      const response = await axios.post(
        `${WA_API_URL}/${WA_PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: 'template',
          template: {
            name: 'auth_otp', // Assuming this template is approved in Meta Business Manager
            language: { code: 'en' },
            components: [
              {
                type: 'body',
                parameters: [{ type: 'text', text: otp }]
              },
              {
                type: 'button',
                sub_type: 'url',
                index: '0',
                parameters: [{ type: 'text', text: otp }]
              }
            ]
          }
        },
        {
          headers: {
            Authorization: `Bearer ${WA_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to send WhatsApp OTP:', error);
      throw error;
    }
  }

  /**
   * Send a PDF Report as a document message
   */
  static async sendReportPDF(phoneNumber: string, pdfUrl: string, fileName: string) {
    try {
      const response = await axios.post(
        `${WA_API_URL}/${WA_PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: 'document',
          document: {
            link: pdfUrl,
            caption: 'Your pathology lab report is ready. Thank you for choosing us!',
            filename: fileName
          }
        },
        {
          headers: {
            Authorization: `Bearer ${WA_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to send WhatsApp PDF:', error);
      throw error;
    }
  }
}

export default WhatsAppService;
