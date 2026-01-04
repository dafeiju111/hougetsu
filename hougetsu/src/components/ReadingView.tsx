"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {Paragraph} from "@/lib/textProcessor";
import { Loader2 } from "lucide-react";

interface ReadingViewProps{
    paragraphs: Paragraph[];
    onToggle:(id:string) => void;
    onBack: () => void;
    onSelect:() => void;
}

export default function ReadingView({paragraphs, onToggle, onBack, onSelect} : ReadingViewProps){
    return (
        <div className="relative h-full">
            <ScrollArea className="h-full w-full">
                <div className="p-8 space-y-6" onMouseUp={onSelect}>
                    {paragraphs.map((para) => (
                        <div
                            key = {para.id}
                            className="group relative flex items-start cursor-pointer p-4 rounded-lg hover:bg-slate-50 transition-all border-l-4 border-transparent hover:border-blue-400"
                        >
                            <p className = "flex-1 text-3xl leading-loose text-slate-900 font-serif pr-12">
                                {para.isShowingTranslation ? (
                                    <span className="text-blue-700 font-sans">
                                        {para.translation || (
                                            <span className="flex items-center gap-2 text-slate-400">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span>...</span>
                                            </span>
                                )}
                                    </span>
                                ):(
                                    <span>{para.original}</span>
                                )}

                            </p>

                            {/* Button in the last line */}
                            <Button
                                size = "sm"
                                variant="ghost"
                                onClick = {()=>onToggle(para.id)}
                                className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 shrink-0 bg-white
                                shadow-sm border-slate-200"
                                >
                                <span className="text-xs text-gray-600 font-bold">
                                    {para.isShowingTranslation ? "←" : "→"}
                                </span>    
                            </Button>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            <Button
                onClick={onBack} 
                className="absolute right-6 bottom-6 rounded-full w-14 h-14 shadow-lg bg-blue-900 hover:bg-blue-800"
            >
                <span className="text-xl">Back</span>
            </Button>
        </div>
        

        )
}