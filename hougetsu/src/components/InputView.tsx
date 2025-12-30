"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface InputViewProps{
    onProcess:(text: string) => void;
    onSelect:() => void;
}

export default function InputView({onProcess,onSelect}: InputViewProps){
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
            />
            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <div className="text-sm text-slate-400">
                    {tempInput.length} characters
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-2">
            
                <Button 
                    variant="outline"
                    onClick = {() => setTempInput("")}
                    disabled={!tempInput.trim()}
                    className="text-slate-500 border-slate-200"
                >
                Clear
                </Button>

                <Button
                    onClick = {() => onProcess(tempInput)}
                    disabled={!tempInput.trim()}
                    className="bg-blue-900 hover:bg-blue-800"
                >
                Process Text
                </Button>
            </div>
        </div>
    );
}