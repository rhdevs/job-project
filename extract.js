const fs = require("fs");
const pdf = require("pdf-parse");

const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: YOUR_API_KEY });

const prompt = "Summarize the text below into a JSON with exactly the following structure {basic_info: {first_name, last_name, full_name, email, phone_number, location, portfolio_website_url, linkedin_url, github_main_page_url, university, education_level (BS, MS, or PhD), graduation_year, graduation_month, majors, GPA}, work_experience: [{job_title, company, location, duration, job_summary}], project_experience:[{project_name, project_description}]}";

async function extractDetailsWithGPT(text) {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo-1106",
            response_format: { type: "json_object" },
            messages: [
                { role: "system", content: "You are a helpful resume assistant designed to output JSON." },
                { role: "user", content: prompt + '\n' + text }
            ]
        });

        const extractedData = response.choices[0].message.content;
        return extractedData;
    } catch (error) {
        console.error("Error using GPT API:", error);
        return {};
    }
}

async function extractResumeDetails(pdfPath) {
    try {
        const pdfFile = fs.readFileSync(pdfPath);
        
        // Parse the PDF content using pdf-parse
        const data = await pdf(pdfFile);

        // Extract text from the parsed data
        const pdfText = data.text;

        // Enhance extraction using GPT API
        const gptExtractedData = await extractDetailsWithGPT(pdfText);
        
        return gptExtractedData;
    } catch (error) {
        console.error("Error extracting resume details:", error);
        return {};
    }
}

async function main() {
    const pdfPath = "C:\\Users\\user\\OneDrive\\Desktop\\job-project\\Junwei's CV.pdf";

    try {
        const resumeData = await extractResumeDetails(pdfPath);
        fs.writeFileSync("resume_data.json", JSON.stringify(resumeData, null, 2));
        console.log("JSON file created successfully!");
    } catch (error) {
        console.error("Error reading or extracting resume details:", error);
    }
}

main();