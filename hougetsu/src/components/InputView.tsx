"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface InputViewProps{
    onProcess:(text: string) => void;
    onSelect:() => void;
    isAnalyzing: boolean;
    shouldAnalyze:boolean;
    onToggleAnalyze: (val: boolean) => void;

}

export default function InputView({onProcess,onSelect,isAnalyzing,shouldAnalyze,onToggleAnalyze}: InputViewProps){
    const [tempInput, setTempInput] = useState("");

    return (
        <div className="flex flex-col h-full gap-4 p-4">
            <Textarea
                placeholder="Paste your text here..."
                className="flex-1 w-full p-4 border-none outline-none resize-none font-serif !text-2xl leading-relaxed bg-transparent overflow-y-auto"
                // style={{ fontSize: "40px", lineHeight: "1.5" }}
                value={tempInput}
                onChange={(e) => setTempInput(e.target.value)}
                onMouseUp = {onSelect}
                disabled={isAnalyzing}
            />

            <div className="flex justify-between pt-4 border-t border-slate-100">
                <div className="text-sm text-slate-400">
                    {tempInput.length} characters
                </div>

                <div className="flex justify-end items-start gap-2 mt-2">
                    <Button 
                        variant="outline"
                        onClick = {() => setTempInput("")}
                        disabled={isAnalyzing || !tempInput.trim()}
                        className="text-slate-500 border-slate-200 h-10  "
                    >
                    Clear
                    </Button>

                    <div className="flex flex-col items-center gap-1">
                        <Button
                            onClick={() => onProcess(tempInput)}
                            disabled={isAnalyzing || !tempInput.trim()}
                            className="bg-blue-900 hover:bg-blue-800 w-full min-w-[120px]" 
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                "Process Text"
                            )}
                        </Button>
                        <label className="flex items-center gap-2 cursor-pointer group leading-none ">
                            <span className={`text-[10px] font-bold transition-colors ${shouldAnalyze ? 'text-blue-900' : 'text-slate-400'}`}>
                                Analysis
                            </span>
                            <div className="relative inline-flex items-center cursor-pointer ">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer" 
                                    checked={shouldAnalyze}
                                    onChange={(e) => onToggleAnalyze(e.target.checked)}
                                    disabled={isAnalyzing}
                                />
                                <div className="w-8 h-4 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-blue-900"></div>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}