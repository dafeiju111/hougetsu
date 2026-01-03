"use client";

import { use, useState } from "react";
import React, { useEffect } from "react";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import InputView from"@/components/InputView";
import ReadingView from"@/components/ReadingView";
import {fetchTranslation} from "@/lib/translate";
import {processTextToParagraphs, Paragraph } from '@/lib/textProcessor';
import {getStoryBackground} from '@/lib/getBackground';
// define language type
const SUPPORTED_LANGUAGES = [
    {label : "Japanese", value : "ja"},
    {label : "English", value : "en"},
    {label : "Chinese", value : "zh"},
    {label : "Korean", value : "ko"},
]

export default function Homepage(){
    //save articles to local storage for test
    const [content, setContent] = useState<string>("段落やtxtファイル、epubファイルをアップロードしてください");
    //save client selected text to storage
    const [selectedText, setSelectedText] = useState<string>("");
    // if is read mode
    const [isReading, setIsReading] = useState<boolean>(false);
    //translated paragraphs
    const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
    //for test
    const handleFileUpload = () =>{
    setContent(
        "吾輩は猫である。名前はまだ無い。"
    );
    };
    // define background from AI
    const [storyContext, setStoryContext] = useState<any>(null);
    // add language selection
    const [sourceLang, setSourceLang] = useState("ja");
    const [targetLang, setTargetLang] = useState("zh");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [shouldAnalyze, setShouldAnalyze] = useState(true);

    const handleMouseUp = () => {
    const selection = window.getSelection();
    const text = selection ? selection.toString().trim() : "";
    if (text) {
        setSelectedText(text);
        console.log("get it", text); 
        if (text) {
        const truncatedText = text.slice(0, 500);
        setSelectedText(truncatedText);
        console.log("Text truncated to 500 chars:", truncatedText); 
    }
    }
    };

const handleProcess = async (text:string) => {
    if (!text.trim()) return;
    const newParagraphs = processTextToParagraphs(text);
    setParagraphs(newParagraphs);

    if (shouldAnalyze) {
        setIsAnalyzing(true);
        try {
            const contextData = await getStoryBackground(text, targetLang);
            setStoryContext(contextData);
            console.log("AI Analysis Success:", contextData);
        } catch (error) {
            console.error("AI Analysis Error:", error);
            // Fallback: Continue without context if analysis fails
        } finally {
            setIsAnalyzing(false);
        }
    } else {
        setStoryContext(null); 
    }

    setIsReading(true);
    
    
}

// change original text / translation text
const toggleTranslation = async (id:string) => {
    // select recent paragraph
    const target = paragraphs.find(p => p.id === id);
    if (!target) return;
    // if has translation
    if (target.translation) {
        setParagraphs(prev => prev.map(p => 
            p.id === id ? { ...p, isShowingTranslation: !p.isShowingTranslation } : p
        ));
        return;
    }

    // if no translation, loading first, then fetch translation
    setParagraphs(prev => prev.map(p => 
        p.id === id ? { ...p, isShowingTranslation: true, status: 'loading' } : p
    ));
    try {
        const result = await fetchTranslation(target.original);
        setParagraphs(prev => prev.map(p => 
            p.id === id ? { 
                ...p, 
                translation: result, 
                status: 'success' 
            } : p
        ));
    } catch (error) {
        setParagraphs(prev => prev.map(p => 
            p.id === id ? { ...p, status: 'error' } : p
        ));
    }
};


return (
    <div className="flex h-screen w-full bg-slate-50">
        {/* Reading area */}
        <div className="w-[70%] h-full p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-4xl font-[family-name:var(--font-quicksand)] font-extrabold tracking-tight">
                    <span className="text-blue-900">Hou</span>
                    <span className="text-[#8b7355]">getsu</span>
                </h1>
                <Button onClick={handleFileUpload}>simulation</Button>
            </div>

            <Card className="flex-1 overflow-hidden shadow-md">
                {!isReading ? (
                    <InputView
                        onProcess={handleProcess}
                        onSelect={handleMouseUp}
                        isAnalyzing={isAnalyzing}
                        shouldAnalyze={shouldAnalyze}
                        onToggleAnalyze={setShouldAnalyze}
                    />
                ) : (
                    <ReadingView
                        paragraphs={paragraphs}
                        onToggle={toggleTranslation}
                        onBack={() => setIsReading(false)}
                        onSelect={handleMouseUp}
                    />
                )}
            </Card>
        </div>

        {/* AI area */}
        <div className="w-[30%] h-full border-l border-slate-200 bg-white p-4 flex flex-col">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-700">AI transport</h2>
                <p className="text-sm text-black">Select text to translate</p>
            </div>

            <div className="mb-6 p-4 bg-slate-100 rounded-lg">
                <span className="text-xs font-bold text-slate-500 uppercase">Selected Text</span>

                <ScrollArea className = "h-32 mt-2 pr-2">
                    <p className="text-xl font-bold text-blue-600 mt-1 min-h-[1.5rem]">
                        {selectedText || "..."}
                    </p>
                </ScrollArea>
            </div>

            <div className="flex-1 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400">
            Output AI response
            </div>
        </div>

    </div>
)
}

