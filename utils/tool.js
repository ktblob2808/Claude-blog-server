const multer = require('multer');
const path = require('path');
const fs = require('fs');
/**
 * Format response data
 * @param {Object} data - The data to include in the response
 * @param {string} msg - Message to include
 * @param {number} code - Response code (0 means success)
 * @returns {Object} - Formatted response
 */
exports.formatResponse = (data, msg = "", code = 0) => {
  return {
    code,
    msg,
    data
  };
};



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../public/static/uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

exports.upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('File upload only supports the following filetypes - ' + filetypes));
  }
});

/**
 * Process markdown content to extract TOC and update HTML headers with IDs
 * @param {Object} reqBody - Request body containing markdownContent and htmlContent
 * @returns {Object} - Updated request body with TOC and modified HTML content
 */
exports.handleToc = (reqBody) => {
  if (!reqBody.markdownContent) {
    return reqBody;
  }

  // Split content into lines for processing
  const lines = reqBody.markdownContent.split('\n');
  const headings = [];
  let inCodeBlock = false;

  // Process each line, tracking if we're inside a code block
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if line starts or ends a code block
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    
    // Skip processing if inside a code block
    if (inCodeBlock) {
      continue;
    }
    
    // Extract heading if the line is a heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length; // Number of # characters determines level
      const name = headingMatch[2].trim();
      const anchor = name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      
      headings.push({
        name,
        anchor,
        level,
        children: []
      });
    }
  }

  // Build hierarchical TOC structure
  const toc = [];
  const levelMap = {};

  headings.forEach(heading => {
    heading.children = [];
    
    if (heading.level === 1) {
      toc.push(heading);
      levelMap[1] = heading;
    } else {
      // Find the closest parent heading
      for (let i = heading.level - 1; i >= 1; i--) {
        if (levelMap[i]) {
          levelMap[i].children.push(heading);
          levelMap[heading.level] = heading;
          break;
        }
      }
    }
  });

  // Update HTML content with anchor IDs
  if (reqBody.htmlContent) {
    headings.forEach(heading => {
      const headingTag = `h${heading.level}`;
      const headingRegex = new RegExp(`<${headingTag}>(${heading.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})</${headingTag}>`, 'g');
      reqBody.htmlContent = reqBody.htmlContent.replace(
        headingRegex, 
        `<${headingTag} id="${heading.anchor}">${heading.name}</${headingTag}>`
      );
    });
  }

  // Add TOC to request body
  reqBody.toc = JSON.stringify(toc);
  
  return reqBody;
};


