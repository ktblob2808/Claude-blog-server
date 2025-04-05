const svgCaptcha = require('svg-captcha');

class CaptchaService {
  generateCaptcha() {
    const captcha = svgCaptcha.create({
      size: 4, // number of characters
      ignoreChars: '0o1il', // characters to exclude
      noise: 2, // number of noise lines
      color: true, // colors
      background: '#f0f0f0' // background color
    });
    
    return {
      text: captcha.text, // captcha text
      svg: captcha.data // SVG image
    };
  }
}

module.exports = new CaptchaService();
