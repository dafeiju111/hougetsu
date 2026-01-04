"use client";

import { use, useState } from "react";
import React, { useEffect } from "react";
import { Loader2, Sparkles, BookOpen } from "lucide-react";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import InputView from"@/components/InputView";
import ReadingView from"@/components/ReadingView";
import {fetchTranslation} from "@/lib/translate";
import {processTextToParagraphs, Paragraph } from '@/lib/textProcessor';
import {getStoryBackground} from '@/lib/getBackground';
import { fetchAiExplanation } from "@/lib/aiExplain";   
// define language type
const SUPPORTED_LANGUAGES = [
    {label : "Japanese", value : "ja"},
    {label : "English", value : "en"},
    {label : "Chinese", value : "zh"},
    //{label : "Korean", value : "ko"},
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
    //AI area
    const [aiExplanation,setAiExplanation] = useState<string>("");
    const [isExplaining,setIsExplaining] = useState<boolean>(false);

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
    const currentIndex = paragraphs.findIndex(p => p.id === id);
    if (currentIndex === -1) return;

    const target = paragraphs[currentIndex];

    // if has translation
    if (target.translation) {
        setParagraphs(prev => prev.map(p => 
            p.id === id ? { ...p, isShowingTranslation: !p.isShowingTranslation } : p
        ));
        return;
    }

    // if no translation, loading first, then fetch translation
    const contexBefore = paragraphs.slice(Math.max(0,currentIndex - 2), currentIndex).map(p => p.original);
    const contexAfter = paragraphs.slice(currentIndex + 1, Math.min(paragraphs.length, currentIndex + 3)).map(p => p.original);
    
    
    setParagraphs(prev => prev.map(p => 
        p.id === id ? { ...p, isShowingTranslation: true, status: 'loading' } : p
    ));
    try {
        const result = await fetchTranslation(
            target.original,
            storyContext,
            sourceLang,
            targetLang,
            contexBefore,
            contexAfter
        );
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

//AI explanation function

const handleExplain = async () => {
    if(!selectedText || isExplaining ) return;

    setIsExplaining(true);
    setAiExplanation("");

    try{
        const result = await fetchAiExplanation(
            selectedText,
            sourceLang,
            targetLang,
            storyContext
        );
        setAiExplanation(result);
    }catch(error){
        console.error("AI Explanation Error:",error);
        setAiExplanation("AI Explanation Error,Please try again");
    }finally{
        setIsExplaining(false);
    }

}


return (
    <div className="flex h-screen w-full bg-slate-50">
        {/* Reading area */}
        <div className="w-[70%] h-full p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-4xl font-[family-name:var(--font-quicksand)] font-extrabold tracking-tight">
                    <span className="text-blue-900">Hou</span>
                    <span className="text-[#8b7355]">getsu</span>
                </h1>
                {/* select source language and translate language */}
                <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
                    {/* source language */}
                    <select 
                        value={sourceLang}
                        onChange={(e) => setSourceLang(e.target.value)}
                        className="bg-transparent text-sm font-medium px-3 py-1.5 focus:outline-none cursor-pointer hover:text-blue-600 transition-colors"
                    >
                        {SUPPORTED_LANGUAGES.map(lang => (
                            <option key={lang.value} value={lang.value}>{lang.label}</option>
                        ))}
                    </select>
                        <div className="text-slate-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </div>

                    {/* translate language */}
                    <select 
                        value={targetLang}
                        onChange={(e) => setTargetLang(e.target.value)}
                        className="bg-transparent text-sm font-medium px-3 py-1.5 focus:outline-none cursor-pointer hover:text-[#8b7355] transition-colors"
                    >
                        {SUPPORTED_LANGUAGES.map(lang => (
                            <option key={lang.value} value={lang.value}>{lang.label}</option>
                        ))}
                    </select>
                </div>
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
        <div className="w-[30%] h-full border-l border-slate-200 bg-white p-4 flex flex-col gap-y-6">

            <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-700">AI transport</h2>
                <p className="text-sm text-black">Select text to translate</p>
            </div>

            <div className="p-4 bg-slate-100 rounded-lg">
                <span className="text-xs font-bold text-slate-500 uppercase">Selected Text</span>

                <ScrollArea className = "h-32 mt-2 pr-2">
                    <p className="text-xl font-bold text-blue-600 mt-1 min-h-[1.5rem]">
                        {selectedText || "..."}
                    </p>
                </ScrollArea>
            </div>
            
            <Button 
                onClick={handleExplain} 
                disabled={!selectedText || isExplaining}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white shadow-lg transition-all"
            >
                {isExplaining ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                    </>
                ) : (
                    "Deep Explain"
                )}
            </Button>
        

            <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 bg-blue-50/30 rounded-xl border border-blue-100/50 overflow-hidden flex flex-col">
                    <ScrollArea className="flex-1 p-5">
                        {aiExplanation ? (
                            <div className="prose prose-sm text-slate-700 whitespace-pre-wrap animate-in fade-in slide-in-from-bottom-2 duration-500">
                                {aiExplanation}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-300 text-center px-4">
                                <BookOpen className="w-8 h-8 mb-2 opacity-20" />
                                <p className="text-xl">Click "Deep Explain" to get detailed explanation, <br/>pronunciation and cultural nuances.</p>
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </div>
        </div>
    </div>
)
}

