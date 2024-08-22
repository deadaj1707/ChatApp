export function generateSummary(text) {
    // Basic summarization: extract first few sentences
    const sentences = text.split('. ').slice(0, 5).join('. ') + '.';
    return sentences;
  }
  