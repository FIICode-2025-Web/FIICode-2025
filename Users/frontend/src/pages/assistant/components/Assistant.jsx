import React from 'react'
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Card, Input, Button, Typography } from "@material-tailwind/react";
const Assistant = () => {
    const [history, setHistory] = useState([
        { from: "assistant", text: "Bună! Cu ce te pot ajuta azi?" }
    ]);
    const [input, setInput] = useState("");
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [history]);

    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMsg = { from: "user", text: input };
        setHistory(h => [...h, userMsg]);
        setInput("");

        try {
            const { data } = await axios.post(
                "http://127.0.0.1:8000/api/v1/assistant/chat",
                { message: input },
                { headers: { "Content-Type": "application/json" } }
            );
            setHistory(h => [...h, { from: "assistant", text: data.reply }]);
        } catch (err) {
            console.error(err);
            setHistory(h => [
                ...h,
                { from: "assistant", text: "A apărut o eroare la procesare" }
            ]);
        }
    };
    return (
        <Card className="bg-gray-800 p-6 rounded-2xl shadow-md space-y-4 w-[330px] md:w-[1200px] h-[600px]">
            <Typography variant="h6" className="mb-2 text-white">
                Asistent Urban
            </Typography>
            <div
                ref={containerRef}
                className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-700 rounded"
                style={{ maxHeight: "400px" }}
            >
                {history.map((m, i) => (
                    <div
                        key={i}
                        className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={
                                m.from === "user"
                                    ? "bg-green-600 text-white p-2 rounded-lg max-w-xs"
                                    : "bg-gray-800 text-white p-2 rounded-lg max-w-xs"
                            }
                        >
                            {m.text}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-2 flex gap-2">
                <Input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendMessage()}
                    className="flex-1 bg-gray-800 text-white"
                    placeholder="Scrie aici..."
                />
                <Button onClick={sendMessage} color="green">
                    Trimite
                </Button>
            </div>
        </Card>
    )
}

export default Assistant