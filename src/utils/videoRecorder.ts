/**
 * Canvas + Audio Video Recorder
 * Exports 1080x1920 (or scaled 9:16) WebM / MP4 video directly from the client browser
 */

export class VideoCanvasRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];

  public startRecording(canvas: HTMLCanvasElement): boolean {
    try {
      this.recordedChunks = [];
      const stream = canvas.captureStream(30); // 30 FPS

      let mimeType = 'video/webm;codecs=vp9';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }

      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 3500000, // High quality
      });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(100);
      return true;
    } catch (err) {
      console.error('MediaRecorder start failed:', err);
      return false;
    }
  }

  public stopRecording(): Promise<Blob | null> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        if (this.recordedChunks.length > 0) {
          const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
          resolve(blob);
        } else {
          resolve(null);
        }
      };

      this.mediaRecorder.stop();
    });
  }

  public static downloadBlob(blob: Blob, filename: string = 'shorts-pilot-video.webm') {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000);
  }
}
