/**
 * Splits text into chunks suitable for embedding.
 * Strategy: Preserves paragraphs (double newlines). 
 * Merges small paragraphs until maxLength is reached.
 * 
 * @param {string} text - Raw text to chunk
 * @param {number} maxLength - Maximum characters per chunk (default 1000)
 * @returns {string[]} Array of text chunks
 */
function chunkText(text, maxLength = 1000) {
  if (!text) return [];

  // Normalize newlines and split by double newline (paragraphs)
  const paragraphs = text.replace(/\r\n/g, '\n').split(/\n\s*\n/);
  const chunks = [];
  let currentChunk = "";

  for (const para of paragraphs) {
    const cleanPara = para.trim();
    if (!cleanPara) continue;

    if (currentChunk.length + cleanPara.length + 1 > maxLength) {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = cleanPara;
    } else {
      currentChunk = currentChunk ? currentChunk + "\n" + cleanPara : cleanPara;
    }
  }

  if (currentChunk) chunks.push(currentChunk);
  return chunks;
}

module.exports = { chunkText };
