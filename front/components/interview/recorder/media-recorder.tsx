"use client";

import { FileAudio } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AudioUploaderProps {
  audioFile: File | null;
  onFileChange: (file: File | null) => void;
}

export default function AudioUploader({
  audioFile,
  onFileChange,
}: AudioUploaderProps) {
  const audioDataRef = useRef<Float32Array[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const mediaStreamSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const sampleRateRef = useRef<number>(44100);
  const [recording, setRecording] = useState(false);

  const encodeWAV = (samples: Float32Array, sampleRate: number) => {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    function writeString(view: DataView, offset: number, str: string) {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    }
    function floatTo16BitPCM(
      output: DataView,
      offset: number,
      input: Float32Array
    ) {
      for (let i = 0; i < input.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      }
    }

    writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true); // PCM chunk size
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, 1, true); // channels
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true); // byte rate
    view.setUint16(32, 2, true); // block align
    view.setUint16(34, 16, true); // bits per sample
    writeString(view, 36, "data");
    view.setUint32(40, samples.length * 2, true);
    floatTo16BitPCM(view, 44, samples);

    return new Blob([view], { type: "audio/wav" });
  };

  const startRecording = async () => {
    audioDataRef.current = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    audioContextRef.current = audioContext;
    sampleRateRef.current = audioContext.sampleRate;

    const mediaStreamSource = audioContext.createMediaStreamSource(stream);
    mediaStreamSourceRef.current = mediaStreamSource;

    const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);
    scriptProcessorRef.current = scriptProcessor;

    mediaStreamSource.connect(scriptProcessor);
    scriptProcessor.connect(audioContext.destination);

    scriptProcessor.onaudioprocess = (e) => {
      const channelData = e.inputBuffer.getChannelData(0);
      audioDataRef.current.push(new Float32Array(channelData));
    };

    setRecording(true);
  };

  const stopRecording = async () => {
    if (
      !audioContextRef.current ||
      !scriptProcessorRef.current ||
      !mediaStreamSourceRef.current
    )
      return;

    scriptProcessorRef.current.disconnect();
    mediaStreamSourceRef.current.disconnect();
    await audioContextRef.current.close();

    let totalLength = 0;
    audioDataRef.current.forEach((arr) => (totalLength += arr.length));
    const mergedSamples = new Float32Array(totalLength);
    let offset = 0;
    audioDataRef.current.forEach((arr) => {
      mergedSamples.set(arr, offset);
      offset += arr.length;
    });

    const wavBlob = encodeWAV(mergedSamples, sampleRateRef.current);

    // ここでBlobからFileオブジェクトを作成し、audioFileにセット
    const wavFile = new File([wavBlob], "recorded.wav", { type: "audio/wav" });
    onFileChange(wavFile);

    setRecording(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.[0]) {
      onFileChange(files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <Input
          id="audio"
          type="file"
          accept="audio/*,.m4a,.wav"
          onChange={handleFileChange}
          className="flex-1"
        />
        {audioFile && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <FileAudio className="w-4 h-4" />
            {audioFile.name}
          </div>
        )}
        <Button
          type="button"
          onClick={recording ? stopRecording : startRecording}
          className="px-3 py-1 rounded bg-blue-600 text-white"
        >
          {recording ? "停止" : "録音開始"}
        </Button>
      </div>
    </div>
  );
}
