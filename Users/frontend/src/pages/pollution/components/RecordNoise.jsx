import React, { useState, useRef } from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import axios from "axios";
import { toast } from "react-toastify";

export default function RecordNoise() {
    const [recording, setRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioBlobs, setAudioBlobs] = useState({});
    const [lastFileName, setLastFileName] = useState(null);
    const [error, setError] = useState(null);
    const audioStreamRef = useRef(null);

    const startRecording = async () => {
        setError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            audioStreamRef.current = stream;
            const rec = new MediaRecorder(stream);
            const chunks = [];
            rec.ondataavailable = e => chunks.push(e.data);
            rec.onstop = () => {
                const ts = new Date().toISOString().replace(/[:.]/g, "-");
                const token = localStorage.getItem("token") || "";
                let userId = "anon";
                try {
                    userId = JSON.parse(atob(token.split(".")[1])).id;
                } catch (_) { }
                const fileName = `noise_${userId}_${ts}.webm`;
                const blob = new Blob(chunks, { type: "audio/webm" });
                setAudioBlobs(prev => ({ ...prev, [fileName]: blob }));
                setLastFileName(fileName);
            };
            rec.start();
            setMediaRecorder(rec);
            setRecording(true);
        } catch (err) {
            console.error(err);
            setError("Nu am putut accesa microfonul.");
        }
    };

    const stopRecording = () => {
        if (!mediaRecorder) return;
        mediaRecorder.stop();
        if (audioStreamRef.current) {
            audioStreamRef.current.getTracks().forEach(t => t.stop());
        }
        setRecording(false);
    };

    const uploadMetadataOnly = async () => {
        if (!lastFileName) return;
        const blob = audioBlobs[lastFileName];
        const arrayBuffer = await blob.arrayBuffer();
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        const data = audioBuffer.getChannelData(0);
        let sumSquares = 0;
        for (let i = 0; i < data.length; i++) sumSquares += data[i] ** 2;
        const rms = Math.sqrt(sumSquares / data.length);
        const decibel = rms > 0 ? 20 * Math.log10(rms) : 0;
        const dBfs = decibel;
        const minDb = -60, maxDb = 0;
        const normalized = (dBfs - minDb) / (maxDb - minDb);
        const score = Math.round(normalized * 100);

        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                const payload = {
                    file_name: lastFileName,
                    decibel: +score.toFixed(2),
                    latitude: coords.latitude,
                    longitude: coords.longitude
                };
                try {
                    const token = localStorage.getItem("token") || "";
                    await axios.post(
                        "http://127.0.0.1:8003/api/v1/noise/",
                        payload,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    toast.success("Înregistrare încărcată cu success!");
                } catch (err) {
                    console.error(err);
                    toast.error("Eroare la încărcarea metadatelor.");
                }
            },
            () => toast.error("Nu am putut obține locația.")
        );
    };

    return (
        <Card className="bg-gray-800 p-6 rounded-2xl shadow-md space-y-4 w-[330px] md:w-[400px]">
            <Typography variant="h5" className="text-white font-semibold">
                Înregistrare zgomot
            </Typography>


            <div className="flex gap-4">
                {!recording ? (
                    <Button color="green" onClick={startRecording}>
                        Începe înregistrarea
                    </Button>
                ) : (
                    <Button color="red" onClick={stopRecording}>
                        Oprește înregistrarea
                    </Button>
                )}
                {lastFileName && (
                    <Button color="blue" onClick={uploadMetadataOnly}>
                        Trimite
                    </Button>
                )}
            </div>

            {lastFileName && (
                <audio
                    controls
                    src={URL.createObjectURL(audioBlobs[lastFileName])}
                    className="mt-4 w-72"
                />
            )}
        </Card>
    );
}
