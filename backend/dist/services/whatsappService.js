"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
    static async sendOTP(phoneNumber, otp) {
        try {
            const response = await axios_1.default.post(`${WA_API_URL}/${WA_PHONE_NUMBER_ID}/messages`, {
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
            }, {
                headers: {
                    Authorization: `Bearer ${WA_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        }
        catch (error) {
            console.error('Failed to send WhatsApp OTP:', error);
            throw error;
        }
    }
    /**
     * Send a PDF Report as a document message
     */
    static async sendReportPDF(phoneNumber, pdfUrl, fileName) {
        try {
            const response = await axios_1.default.post(`${WA_API_URL}/${WA_PHONE_NUMBER_ID}/messages`, {
                messaging_product: 'whatsapp',
                to: phoneNumber,
                type: 'document',
                document: {
                    link: pdfUrl,
                    caption: 'Your pathology lab report is ready. Thank you for choosing us!',
                    filename: fileName
                }
            }, {
                headers: {
                    Authorization: `Bearer ${WA_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        }
        catch (error) {
            console.error('Failed to send WhatsApp PDF:', error);
            throw error;
        }
    }
}
exports.default = WhatsAppService;
