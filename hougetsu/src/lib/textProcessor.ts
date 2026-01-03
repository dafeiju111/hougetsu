export interface Paragraph {
    id: string;
    original: string;
    translation: string;
    status: 'idle' | 'loading' | 'success' | 'error';
    isShowingTranslation: boolean;
}

export const processTextToParagraphs = (text: string): Paragraph[] => {
    // Split by newline and filter empty lines
    const segments = text.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

    // Map strings to paragraph objects with unique IDs
    return segments.map((line, index) => ({
        id: `para-${Date.now()}-${index}`,
        original: line,
        translation: "",
        status: 'idle',
        isShowingTranslation: false
    }));
};