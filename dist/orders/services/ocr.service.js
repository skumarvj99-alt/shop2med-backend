"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OcrService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const Tesseract = require("tesseract.js");
const sharp = require("sharp");
const pdfParse = require('pdf-parse');
let OcrService = class OcrService {
    constructor(configService) {
        this.configService = configService;
    }
    async processImage(imageBuffer) {
        try {
            if (!imageBuffer || imageBuffer.length === 0) {
                throw new Error('Empty image buffer');
            }
            const text = await this.extractTextWithAutoRotation(imageBuffer);
            if (!text.trim())
                return { text: '', confidence: 0, items: [], supplierInfo: {} };
            const parsed = this.parseIndianMedicalInvoice(text);
            return {
                text,
                confidence: parsed.items.length > 0 ? 75 : 30,
                items: parsed.items,
                supplierInfo: parsed.supplierInfo,
            };
        }
        catch (error) {
            console.error('Image OCR error:', error);
            return { text: '', confidence: 0, items: [], supplierInfo: {} };
        }
    }
    async processPdf(pdfBuffer) {
        try {
            if (!pdfBuffer || pdfBuffer.length === 0)
                throw new Error('Empty PDF buffer');
            let text = '';
            try {
                const pdfData = await pdfParse(pdfBuffer);
                text = pdfData.text || '';
            }
            catch (e) {
                console.warn('pdf-parse failed:', e.message);
            }
            if (!text.trim()) {
                const jpeg = this.extractJpegFromPdf(pdfBuffer);
                if (jpeg) {
                    text = await this.extractTextWithAutoRotation(jpeg);
                }
            }
            if (!text.trim())
                return { text: '', confidence: 0, items: [], supplierInfo: {} };
            const parsed = this.parseIndianMedicalInvoice(text);
            return {
                text,
                confidence: 90,
                items: parsed.items,
                supplierInfo: parsed.supplierInfo,
            };
        }
        catch (error) {
            console.error('PDF processing error:', error);
            return { text: '', confidence: 0, items: [], supplierInfo: {} };
        }
    }
    async extractTextWithAutoRotation(imageBuffer) {
        const angles = [0, 90, 180, 270];
        let bestText = '';
        let bestScore = -1;
        for (const angle of angles) {
            try {
                const rotated = angle !== 0
                    ? await sharp(imageBuffer).rotate(angle).toBuffer()
                    : imageBuffer;
                const processed = await this.preprocessImage(rotated);
                const result = await Tesseract.recognize(processed, 'eng', { logger: () => { } });
                const text = result.data.text || '';
                const score = this.scoreMedText(text);
                if (score > bestScore) {
                    bestScore = score;
                    bestText = text;
                }
            }
            catch (err) {
                console.warn(`Rotation ${angle} failed:`, err.message);
            }
        }
        return bestText;
    }
    scoreMedText(text) {
        const t = text.toUpperCase();
        const kw = ['TAB', 'CAP', 'SYRUP', 'INJ', 'CREAM', 'VIAL', 'MG', 'ML', 'INVOICE', 'GSTIN', 'MRP', 'PHARMA', 'MEDICAL'];
        return kw.reduce((sum, k) => sum + (t.includes(k) ? 1 : 0), 0);
    }
    extractJpegFromPdf(buffer) {
        let start = -1;
        for (let i = 0; i < buffer.length - 3; i++) {
            if (buffer[i] === 0xff && buffer[i + 1] === 0xd8 && buffer[i + 2] === 0xff) {
                start = i;
                break;
            }
        }
        if (start === -1)
            return null;
        let end = -1;
        for (let i = buffer.length - 2; i >= start; i--) {
            if (buffer[i] === 0xff && buffer[i + 1] === 0xd9) {
                end = i + 2;
                break;
            }
        }
        if (end === -1)
            return null;
        return buffer.slice(start, end);
    }
    async preprocessImage(buf) {
        return sharp(buf)
            .resize(2400, null, { fit: 'inside', withoutEnlargement: false })
            .greyscale()
            .normalize()
            .sharpen({ sigma: 1.5 })
            .toBuffer();
    }
    parseIndianMedicalInvoice(text) {
        const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        const items = [];
        const supplierInfo = {};
        for (let i = 0; i < Math.min(10, lines.length); i++) {
            const line = lines[i];
            const invMatch = line.match(/inv(?:oice)?\s*no[:\s]+([A-Z0-9\-\/]+)/i);
            if (invMatch && !supplierInfo.invoiceNumber)
                supplierInfo.invoiceNumber = invMatch[1].trim();
            const dateMatch = line.match(/inv(?:oice)?\s*date[:\s]+(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/i);
            if (dateMatch && !supplierInfo.invoiceDate)
                supplierInfo.invoiceDate = dateMatch[1];
            const phoneMatch = line.match(/(?:ph(?:one)?|mob(?:ile)?)[:\s#]*(?:\+?91[-\s]?)?([6-9]\d{9})/i);
            if (phoneMatch && !supplierInfo.phone)
                supplierInfo.phone = phoneMatch[1];
            if (!supplierInfo.name && line.length > 5 && !/^\d/.test(line)
                && !/^(gst|inv|d\.no|pan|gstin|dl no)/i.test(line)) {
                supplierInfo.name = line.replace(/\|.*$/, '').trim();
            }
        }
        const SKIP = /^(sl|s\.no|product|name|qty|quantity|price|rate|amount|mfg|packing|hsn|batch|exp|total|note|software|cgst|sgst|subtotal|less|net pay|five|the\s|e\.\&|subject)/i;
        for (const line of lines) {
            if (SKIP.test(line))
                continue;
            if (line.length < 15)
                continue;
            const stripped = line.replace(/^[A-Za-z]{1,5}[\s]*[|\]]\s*/i, '').trim();
            const packMatch = stripped.match(/^(.+?)\s+(1\*[\w]+)\s/i);
            if (!packMatch)
                continue;
            const medicineName = this.cleanName(packMatch[1]);
            const packing = packMatch[2];
            const after = stripped.slice(packMatch[0].length);
            if (!medicineName || medicineName.length < 3)
                continue;
            const parsed = this.parseAfterPacking(after);
            if (!parsed)
                continue;
            const packSizeMatch = packing.match(/1\*(\d+)/i);
            const packSize = packSizeMatch ? parseInt(packSizeMatch[1], 10) : undefined;
            items.push({
                medicineName,
                packing,
                packSize,
                quantity: parsed.quantity,
                unitPrice: parsed.unitPrice,
                mrp: parsed.mrp,
                cgst: parsed.cgst,
                sgst: parsed.sgst,
                totalPrice: parsed.totalPrice,
            });
        }
        return { items, supplierInfo };
    }
    parseAfterPacking(after) {
        let s = after;
        s = s.replace(/(\d)\.\s+(\d)/g, '$1.$2');
        s = s.replace(/~(\d)/g, '$1');
        s = s.replace(/"(\d)/g, '$1');
        s = s.replace(/(\d),\s*(\d)/g, '$1.$2');
        s = s.replace(/NET/g, ' 0.0 ');
        s = s.replace(/(\d+)-(\d{1,3})(?=\s|$|\)|\]|\||,)/g, '$1.$2');
        const raw = s.match(/\d+(?:\.\d+)?/g) || [];
        const nums = raw.map(n => parseFloat(n)).filter(n => n < 9_999_999);
        if (nums.length < 5)
            return null;
        const total = nums[nums.length - 1];
        const FACTOR = 0.96 * 1.05;
        const disCandidates = nums
            .map((n, i) => ({ n, i }))
            .filter(({ n }) => Math.abs(n - 4.0) < 0.06)
            .reverse();
        for (const { i: di } of disCandidates) {
            if (di < 1 || di + 1 >= nums.length)
                continue;
            const rate = nums[di - 1];
            let mrp = nums[di + 1];
            if (di + 2 < nums.length && nums[di + 2] > mrp && nums[di + 2] >= rate) {
                mrp = nums[di + 2];
            }
            if (rate < 3 || rate >= 5000)
                continue;
            if (mrp < rate)
                continue;
            const qtyExact = total / (rate * FACTOR);
            let qty = Math.round(qtyExact);
            if (Math.abs(qtyExact - qty) > 0.25) {
                const floor = Math.floor(qtyExact);
                if (Math.abs(qtyExact - floor - 0.5) < 0.12) {
                    qty = floor;
                }
                else {
                    continue;
                }
            }
            if (qty < 1 || qty > 500)
                continue;
            const baseAmount = qty * rate * (1 - 0.04);
            const totalGst = total - baseAmount;
            const cgst = totalGst / 2;
            const sgst = totalGst / 2;
            return { quantity: qty, unitPrice: rate, mrp, totalPrice: total, cgst, sgst };
        }
        return null;
    }
    cleanName(raw) {
        return raw
            .replace(/[|)\]]/g, ' ')
            .replace(/[^A-Za-z0-9 \-\/\.]/g, ' ')
            .replace(/\s{2,}/g, ' ')
            .trim()
            .substring(0, 80);
    }
};
exports.OcrService = OcrService;
exports.OcrService = OcrService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], OcrService);
//# sourceMappingURL=ocr.service.js.map