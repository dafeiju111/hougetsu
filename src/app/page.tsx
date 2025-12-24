"use client";

import { use, useState } from "react";
import React, { useEffect } from "react";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

export default function Homepage(){
    //save articles to local storage
    const [content, setContent] = useState<string>("段落やtxtファイル、epubファイルをアップロードしてください");
    //save client selected text to storage
    const [selectedText, setSelectedText] = useState<string>("");

    //for test
    const handleFileUpload = () =>{
    setContent(
        "吾輩は猫である。名前はまだ無い。"
    );
    };

    const handleMouseUp = () => {
    const selection = window.getSelection();
    const text = selection ? selection.toString().trim() : "";
    if (text) {
        setSelectedText(text);
        console.log("get it", text); 
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
                <ScrollArea className="h-full">
                    <div
                        className="text-lg leading-loose text-slate-900 font-serif cursor-text p-8" onMouseUp={handleMouseUp}
                    >
                        {content}
                    </div>
                </ScrollArea>
            </Card>
        </div>

        {/* AI area */}
        <div className="w-[30%] h-full border-l border-slate-200 bg-white p-4 flex flex-col">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-700">AI transport</h2>
                <p className="text-sm text-black">Select text to translate</p>
            </div>

            <div className="mb-6 p-4 bg-slate-100 rounded-lg">
                <span className="text-xs font-bold text-slate-500 uppercase">Selected Tex</span>
                <p className="text-xl font-bold text-blue-600 mt-1 min-h-[1.5rem]">
                    {selectedText || "..."}
                </p>
            </div>

            <div className="flex-1 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400">
            Output AI response
            </div>
        </div>

    </div>
)
}

