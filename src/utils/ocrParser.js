export const parseOCRResult = (text) => {
  const lines = text.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  let parsedData = { 
    memo: text, 
    name: '',
    company: '',
    role: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    fax: ''
  }; 

  // --- Constants & Regex Patterns ---

  // 1. Phone Numbers: Mobile, Landline
  // Supports: 010-1234-5678, 02-123-4567, 031.123.4567, +82-10-..., (010) ...
  const phoneRegex = /(?:(?:\+?82)|0)(?:1[0-9]|2|3[1-3]|4[1-4]|5[1-5]|6[1-4])[-. ]?\d{3,4}[-. ]?\d{4}/;
  
  // 2. Fax Numbers: Often labeled with F, Fax, 팩스
  // We look for the label specifically to distinguish from phone
  const faxLabelRegex = /(?:F|Fax|팩스)[:.]?\s*([\d-. ]+)/i;

  // 3. Email
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

  // 4. Website
  const urlRegex = /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.(?:com|co\.kr|kr|net|org|io)(?:\/[^\s]*)?/;

  // 5. Company Suffixes (Keywords)
  const companyKeywords = [
    '주식회사', '(주)', 'Inc', 'Co', 'Ltd', 'Corporation', 'Company', 
    'Corp', 'KOREA', 'Bank', 'Group', 'Agency', 'Studio', 'Lab'
  ];

  // 6. Job Titles (Rank/Role)
  const roleKeywords = [
    '대표', '사장', '회장', '이사', '본부장', '전무', '상무', '부사장', 
    '팀장', '부장', '차장', '과장', '대리', '사원', '주임', '연구원', 
    '매니저', '센터장', '지점장', '실장', 'Manager', 'CEO', 'CTO', 'COO', 
    'Director', 'President', 'Chief', 'Engineer', 'Designer', 'Developer'
  ];

  // 7. Address Keywords (Korean provinces/cities)
  const addressKeywords = [
    '서울', '경기', '부산', '대구', '인천', '광주', '대전', '울산', 
    '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
    '시', '구', '동', '로', '길', '마을', 'B/D', '빌딩', '타워'
  ];

  // --- Parsing Logic ---

  let remainingLines = [...lines]; // Clone to manipulate

  // Strategy: Identify and remove clear matches first to reduce noise for ambiguous fields (Name, Company)

  // A. Extract Email
  const emailIndex = remainingLines.findIndex(line => emailRegex.test(line));
  if (emailIndex !== -1) {
    parsedData.email = remainingLines[emailIndex].match(emailRegex)[0];
    // Don't remove line yet if it has other info, but typically unique on a line
    // Or just mark as processed. For simplicity, we assume one field per line roughly
  }

  // B. Extract Website
  const urlIndex = remainingLines.findIndex(line => urlRegex.test(line) && !line.includes('@')); // Avoid email matching
  if (urlIndex !== -1) {
    const match = remainingLines[urlIndex].match(urlRegex);
    if(match) parsedData.website = match[0];
  }

  // C. Extract Fax
  const faxIndex = remainingLines.findIndex(line => faxLabelRegex.test(line));
  if (faxIndex !== -1) {
    const match = remainingLines[faxIndex].match(faxLabelRegex);
    if (match) parsedData.fax = match[1].trim();
  }

  // D. Extract Phone (Mobile or main office)
  // If we found a fax on a line, we shouldn't treat that exact match as phone if possible, 
  // but regex might overlap.
  const phoneIndex = remainingLines.findIndex(line => {
    if (faxLabelRegex.test(line)) return false; // Skip fax lines
    return phoneRegex.test(line);
  });
  if (phoneIndex !== -1) {
    const match = remainingLines[phoneIndex].match(phoneRegex);
    if (match) parsedData.phone = match[0].replace(/[ .]/g, '-');
  }

  // E. Extract Address
  // Look for lines containing address keywords and numbers (for street number/zip)
  const addressIndex = remainingLines.findIndex(line => {
    // Must have at least 2 address keywords or (1 keyword + numbers) to be confident
    let score = 0;
    addressKeywords.forEach(kw => { if(line.includes(kw)) score++; });
    return score >= 2 || (score >= 1 && /\d/.test(line));
  });
  if (addressIndex !== -1) {
    parsedData.address = remainingLines[addressIndex];
  }

  // --- Heuristics for Name, Role, Company ---

  // Remaining lines that are NOT identified as contact info
  const candidateLines = lines.filter((line, idx) => 
    idx !== emailIndex && idx !== urlIndex && idx !== faxIndex && 
    idx !== phoneIndex && idx !== addressIndex
  );

  for (const line of candidateLines) {
    // 1. Role Detection
    // If a line contains a role keyword, it's likely the Role field OR "Name Role"
    const matchedRole = roleKeywords.find(keyword => line.includes(keyword));
    
    if (matchedRole) {
      if (!parsedData.role) {
        parsedData.role = line; // Potentially full string like "Sales Manager" or "Kim Developer"
        
        // If the line is short (<= 3 words) and has a role, maybe it contains the name too
        const parts = line.split(/\s+/);
        if (parts.length > 1) {
             // Heuristic: "Hong Gil Dong Manager" -> Name: Hong Gil Dong, Role: Manager
             // This is hard to split perfectly without Named Entity Recognition (NER), 
             // but we can try removing the role keyword to see what's left.
        }
      }
      continue; // Move to next line
    }

    // 2. Company Detection
    const matchedCompany = companyKeywords.find(keyword => 
      line.toUpperCase().includes(keyword.toUpperCase())
    );
    if (matchedCompany && !parsedData.company) {
      parsedData.company = line;
      continue;
    }

    // 3. Name Detection
    // If it's not role, not company, not contact info... likely a Name.
    // Names are usually short (2-4 chars Korean, 2-3 words English).
    if (!parsedData.name && !matchedCompany && !matchedRole) {
      if (line.length >= 2 && line.length < 20) {
        // Simple heuristic: First unidentified short line is often the name
        parsedData.name = line;
      }
    }
  }
  
  return parsedData;
};
