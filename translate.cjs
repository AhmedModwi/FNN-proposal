const translate = require("google-translate-api-x");
const fs = require("fs");
const path = require("path");

const files = ["color.astro", "typography.astro", "structure.astro", "motion.astro", "photography.astro"];

async function processFile(filename) {
    console.log(`Processing ${filename}...`);
    const filePath = path.join(__dirname, "src/pages", filename);
    let content = fs.readFileSync(filePath, "utf-8");

    // Split by HTML tags
    const parts = content.split(/(<[^>]+>)/g);
    
    let textsToTranslate = [];
    let textIndices = [];
    const arabicRegex = /[\u0600-\u06FF]/;

    for (let i = 0; i < parts.length; i++) {
        // Even indices are text outside tags
        if (i % 2 === 0) {
            let text = parts[i];
            if (arabicRegex.test(text)) {
                textsToTranslate.push(text.trim());
                textIndices.push(i);
            }
        }
    }

    if (textsToTranslate.length === 0) {
        console.log(`No Arabic text found in ${filename}`);
        return;
    }

    console.log(`Found ${textsToTranslate.length} text fragments in ${filename}. Translating...`);
    
    const chunkSize = 50;
    let translatedTexts = [];
    for (let i = 0; i < textsToTranslate.length; i += chunkSize) {
        let chunk = textsToTranslate.slice(i, i + chunkSize);
        try {
            const res = await translate(chunk, { to: 'en' });
            // API returns array of objects for chunked input
            const translatedChunk = Array.isArray(res) ? res.map(r => r.text) : [res.text];
            translatedTexts.push(...translatedChunk);
        } catch (error) {
            console.error(`Translation error at chunk ${i}:`, error.message);
            // Fallback to original text if error
            translatedTexts.push(...chunk);
        }
        await new Promise(r => setTimeout(r, 1000));
    }

    let translatedIndex = 0;
    for (let i = 0; i < parts.length; i++) {
        if (i % 2 === 0 && textIndices.includes(i)) {
            let originalText = parts[i];
            let trimmedOriginal = originalText.trim();
            let transText = translatedTexts[translatedIndex];
            
            // Re-apply leading/trailing whitespace using regex logic safely
            const textMatch = originalText.match(/^(\s*)([\s\S]*?)(\s*)$/);
            let leadingSpace = textMatch ? textMatch[1] : '';
            let trailingSpace = textMatch ? textMatch[3] : '';

            // Double check to ensure we only apply spans to non-empty translations
            if (trimmedOriginal) {
                parts[i] = `${leadingSpace}<span class="lang-ar">${trimmedOriginal}</span><span class="lang-en hidden">${transText}</span>${trailingSpace}`;
            }
            translatedIndex++;
        }
    }

    const newContent = parts.join('');
    fs.writeFileSync(filePath, newContent, "utf-8");
    console.log(`Done translating ${filename}.`);
}

async function run() {
    for (let f of files) {
        await processFile(f);
    }
    console.log("All files translated successfully!");
}

run();
