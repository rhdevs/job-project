const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");
const fs = require('fs');
const path = require('path');

const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: "YOUR-API-KEY" });

const prompt = "Write a cover letter based on the JSON files given. Use all information given. Do not put placeholders. Use correct cover letter format and whitespace and indentation. The date is "+ new Date().toLocaleDateString();

function retrieveJobJSON() {
  // Sample Job, replace with actual job JSON
  return '{"job_title": "Software Engineer Intern", "company": "Microsoft", "internship_type": "full-time", "eligible_years": [2,3,4], "start_date": "2023-04-01", "end_date": "2023-07-31", "location": "182 Cecil St, #13-01, Singapore 069547", "job_description": "We are looking for a Software Engineer Intern to join our team. You will work with our engineers to develop and maintain high quality mobile applications. If you are passionate about mobile platforms and translating code into user-friendly apps, we would like to meet you. As a Software Engineer Intern, you will collaborate with internal teams to develop functional mobile applications, while working in a fast-paced environment. Ultimately, you should be able to design and build the next generation of our mobile applications.", "job_requirements": ["Experience with third-party libraries and APIs", "Familiarity with OOP design principles", "Excellent analytical skills with a good problem-solving attitude"] }';
}

function retrieveResumeJSON() {
  return fs.readFileSync('resume_data.json'); // Don't parse first, let ChatGPT have the text
}

async function writeCoverLetter() {
  try {
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages: [
            { role: "system", content: "You are a helpful resume assistant designed to write a cover letter." },
            { role: "user", content: prompt + '\nJob description:' + retrieveJobJSON() + '\nApplicant resume:' + retrieveResumeJSON() },
        ]
    });
      const extractedData = response.choices[0].message.content;
      return extractedData;
  } catch (error) {
      console.error("Error using GPT API:", error);
      return {};
  }
}

async function saveCoverLetter(extractedData) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
  pdfMake.vfs['times-new-roman.ttf'] = fs.readFileSync(path.join(__dirname, 'times-new-roman.ttf'), 'base64');
  pdfMake.fonts = {
    TimesNewRoman: {
      normal: 'times-new-roman.ttf'
    }
  };
  const docDefinition = {
    content: [{text:extractedData, font:'TimesNewRoman', fontSize:12}]
  };
  const pdfDoc = pdfMake.createPdf(docDefinition);
  pdfDoc.getBuffer((buffer) => {
      fs.writeFileSync('Cover Letter.pdf', buffer);
    });
}

async function main() {
  const extractedData = await writeCoverLetter();
  await saveCoverLetter(extractedData);
}

main()
