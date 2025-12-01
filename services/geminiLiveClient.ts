import { GoogleGenAI, LiveServerMessage, Modality, Type, FunctionDeclaration } from '@google/genai';
import { createPcmBlob, decodeAudioData, decodeBase64String, blobToBase64 } from './audioUtils';
import { UserProfile, TranscriptItem } from '../types';

export class GeminiLiveClient {
  private ai: GoogleGenAI;
  private inputAudioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private sessionPromise: Promise<any> | null = null;
  private nextStartTime = 0;
  private isConnected = false;
  private videoInterval: number | null = null;
  
  // Transcription state
  private currentInputTranscription = '';
  private currentOutputTranscription = '';
  public transcriptHistory: TranscriptItem[] = [];

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async connect(
    profile: UserProfile, 
    companyName: string,
    role: string,
    onAudioData: (volume: number) => void,
    onError: (error: Error) => void,
    onComplete: () => void
  ) {
    this.transcriptHistory = []; // Reset history

    try {
      // 1. Setup Audio Contexts
      this.inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      this.outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      if (this.inputAudioContext.state === 'suspended') await this.inputAudioContext.resume();
      if (this.outputAudioContext.state === 'suspended') await this.outputAudioContext.resume();

      // 2. Get Media Stream
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // 3. Define Tools
      const endInterviewTool: FunctionDeclaration = {
        name: 'end_interview',
        description: 'Call this function to end the interview session when the interview is naturally complete.',
        parameters: {
          type: Type.OBJECT,
          properties: {
            reason: { type: Type.STRING, description: "The reason for ending (e.g. 'Interview Complete')" },
          },
        },
      };

      // 4. Configure System Instruction
      const systemInstruction = `
        You are "Alex", a senior engineering manager at ${companyName}.
        Your goal is to evaluate ${profile.name} for the ${role} role.
        
        Candidate Resume Snippet: "${profile.resumeText.slice(0, 300)}..."

        INTERVIEW PROTOCOL:
        1.  **Greeting**: Brief welcome.
        2.  **Question 1 (Intro)**: "Tell me about yourself."
        3.  **Question 2 (Resume)**: Deep dive into a project from their resume.
        4.  **Question 3 (Technical/Role-Specific)**: 
            - IF the role is technical: Ask conceptual technical questions, system design discussions, or verbal problem-solving scenarios. **DO NOT** ask the user to write code or share their screen.
            - IF the role is non-technical: Ask role-specific scenario questions.
        5.  **Deep Dive & Follow-ups**: Ask relevant follow-up questions based on the candidate's responses. Dig deeper into their thought process.
        6.  **Closing**: When the conversation reaches a natural conclusion, thank the candidate and say you will be in touch.

        RULES:
        - Conduct a natural, professional interview.
        - Ask approx 5-8 questions in total, but adapt to the flow.
        - Keep responses short (under 20s).
        - Be professional but demanding.
        - **NEVER** ask the user to share their screen or open a code editor. All technical evaluation must be done verbally.
      `;

      // 5. Connect to Gemini Live
      this.sessionPromise = this.ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            console.log('Gemini Live Session Opened');
            this.isConnected = true;
            this.startAudioInputStream();
          },
          onmessage: async (message: LiveServerMessage) => {
            // 1. Handle Audio & Transcription
            await this.handleServerMessage(message, onAudioData);

            // 2. Handle Tool Calls
            if (message.toolCall) {
                // Check for End Interview
                const endCall = message.toolCall.functionCalls.find(fc => fc.name === 'end_interview');
                if (endCall) {
                    console.log("AI requested to end interview.");
                    let remainingDuration = 0;
                    if (this.outputAudioContext) {
                        const currentTime = this.outputAudioContext.currentTime;
                        if (this.nextStartTime > currentTime) {
                            remainingDuration = this.nextStartTime - currentTime;
                        }
                    }
                    setTimeout(() => {
                        onComplete();
                    }, remainingDuration * 1000 + 1000);
                }
            }
          },
          onerror: (e: ErrorEvent) => {
            console.error('Gemini Live Error', e);
            onError(new Error("Connection error. Please check your API key and try again."));
          },
          onclose: (e: CloseEvent) => {
            console.log('Gemini Live Session Closed', e);
            this.isConnected = false;
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          systemInstruction: systemInstruction,
          tools: [{ functionDeclarations: [endInterviewTool] }],
          inputAudioTranscription: {}, 
          outputAudioTranscription: {},
        },
      });

      await this.sessionPromise;
      
    } catch (err) {
      console.error("Failed to connect", err);
      onError(err instanceof Error ? err : new Error("Failed to connect"));
    }
  }

  private startAudioInputStream() {
    if (!this.inputAudioContext || !this.mediaStream || !this.sessionPromise) return;

    const source = this.inputAudioContext.createMediaStreamSource(this.mediaStream);
    const processor = this.inputAudioContext.createScriptProcessor(4096, 1, 1);

    processor.onaudioprocess = (e) => {
      if (!this.isConnected) return;
      
      const inputData = e.inputBuffer.getChannelData(0);
      const pcmBlob = createPcmBlob(inputData);
      
      this.sessionPromise!.then((session) => {
        session.sendRealtimeInput({ media: pcmBlob });
      });
    };

    source.connect(processor);
    processor.connect(this.inputAudioContext.destination);
  }

  private async handleServerMessage(message: LiveServerMessage, onAudioData: (vol: number) => void) {
    const serverContent = message.serverContent;
    if (serverContent) {
        if (serverContent.outputTranscription?.text) {
            this.currentOutputTranscription += serverContent.outputTranscription.text;
        }
        if (serverContent.inputTranscription?.text) {
            this.currentInputTranscription += serverContent.inputTranscription.text;
        }

        if (serverContent.turnComplete) {
            if (this.currentInputTranscription.trim()) {
                this.transcriptHistory.push({
                    role: 'user',
                    text: this.currentInputTranscription.trim(),
                    timestamp: new Date()
                });
                this.currentInputTranscription = '';
            }
            if (this.currentOutputTranscription.trim()) {
                 this.transcriptHistory.push({
                    role: 'assistant',
                    text: this.currentOutputTranscription.trim(),
                    timestamp: new Date()
                });
                this.currentOutputTranscription = '';
            }
        }
    }

    if (!this.outputAudioContext) return;

    const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
    
    if (base64Audio) {
      // Decode audio
      const audioBuffer = await decodeAudioData(
        decodeBase64String(base64Audio),
        this.outputAudioContext,
        24000,
        1
      );

      // Simple visualizer hook
      const rawData = audioBuffer.getChannelData(0);
      let sum = 0;
      for(let i=0; i<rawData.length; i+=10) { 
         sum += Math.abs(rawData[i]);
      }
      const avg = sum / (rawData.length / 10);
      onAudioData(avg);

      // Schedule playback
      this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext.currentTime);
      
      const source = this.outputAudioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.outputAudioContext.destination);
      source.start(this.nextStartTime);
      
      this.nextStartTime += audioBuffer.duration;
    }
  }

  public startVideoStream(videoElement: HTMLVideoElement) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const FPS = 2; // Low FPS for token efficiency
    
    this.videoInterval = window.setInterval(async () => {
      if (!this.isConnected || !this.sessionPromise || !ctx || !videoElement.videoWidth) return;

      canvas.width = videoElement.videoWidth * 0.5; 
      canvas.height = videoElement.videoHeight * 0.5;
      
      ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          const base64Data = await blobToBase64(blob);
          this.sessionPromise!.then((session) => {
             session.sendRealtimeInput({
                media: {
                  mimeType: 'image/jpeg',
                  data: base64Data
                }
             });
          });
        }
      }, 'image/jpeg', 0.6);

    }, 1000 / FPS);
  }

  public async disconnect() {
    this.isConnected = false;
    
    // Capture final transcripts if any
    if (this.currentInputTranscription.trim()) {
        this.transcriptHistory.push({ role: 'user', text: this.currentInputTranscription, timestamp: new Date() });
    }
    if (this.currentOutputTranscription.trim()) {
        this.transcriptHistory.push({ role: 'assistant', text: this.currentOutputTranscription, timestamp: new Date() });
    }

    if (this.videoInterval) {
      clearInterval(this.videoInterval);
      this.videoInterval = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    if (this.inputAudioContext) {
      await this.inputAudioContext.close();
      this.inputAudioContext = null;
    }

    if (this.outputAudioContext) {
      await this.outputAudioContext.close();
      this.outputAudioContext = null;
    }
  }
}