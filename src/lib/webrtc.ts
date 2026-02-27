import { supabase } from './supabase';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

export class WebRTCManager {
  private pc: RTCPeerConnection | null = null;
  private sessionCode: string;
  private isSender: boolean;
  private stream: MediaStream | null = null;
  private onStreamCallback: ((stream: MediaStream) => void) | null = null;
  private onConnectionStateCallback: ((state: string) => void) | null = null;
  private realtimeChannel: any = null;

  constructor(sessionCode: string, isSender: boolean) {
    this.sessionCode = sessionCode;
    this.isSender = isSender;
  }

  async initialize() {
    this.pc = new RTCPeerConnection(ICE_SERVERS);

    this.pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendIceCandidate(event.candidate);
      }
    };

    this.pc.onconnectionstatechange = () => {
      if (this.pc) {
        this.onConnectionStateCallback?.(this.pc.connectionState);
      }
    };

    if (!this.isSender) {
      this.pc.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          this.onStreamCallback?.(event.streams[0]);
        }
      };
    }

    this.subscribeToSession();
  }

  private async subscribeToSession() {
    this.realtimeChannel = supabase
      .channel(`session:${this.sessionCode}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sessions',
          filter: `code=eq.${this.sessionCode}`,
        },
        async (payload) => {
          const session = payload.new;

          if (this.isSender && session.answer && !this.pc?.remoteDescription) {
            await this.pc?.setRemoteDescription(
              new RTCSessionDescription(session.answer as RTCSessionDescriptionInit)
            );
          }

          if (!this.isSender && session.offer && !this.pc?.remoteDescription) {
            await this.handleOffer(session.offer as RTCSessionDescriptionInit);
          }

          const candidates = this.isSender
            ? session.receiver_ice_candidates
            : session.sender_ice_candidates;

          if (candidates && Array.isArray(candidates)) {
            for (const candidate of candidates) {
              if (candidate && !this.hasAddedCandidate(candidate)) {
                try {
                  await this.pc?.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (error) {
                  console.error('Error adding ICE candidate:', error);
                }
              }
            }
          }
        }
      )
      .subscribe();
  }

  private addedCandidates = new Set<string>();

  private hasAddedCandidate(candidate: any): boolean {
    const key = `${candidate.candidate}`;
    if (this.addedCandidates.has(key)) {
      return true;
    }
    this.addedCandidates.add(key);
    return false;
  }

  private async handleOffer(offer: RTCSessionDescriptionInit) {
    if (!this.pc) return;

    await this.pc.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);

    const { data: session } = await supabase
      .from('sessions')
      .select('*')
      .eq('code', this.sessionCode)
      .maybeSingle();

    if (session) {
      await supabase
        .from('sessions')
        .update({
          answer: answer as any,
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.id);
    }
  }

  private async sendIceCandidate(candidate: RTCIceCandidate) {
    const { data: session } = await supabase
      .from('sessions')
      .select('*')
      .eq('code', this.sessionCode)
      .maybeSingle();

    if (!session) return;

    const field = this.isSender ? 'sender_ice_candidates' : 'receiver_ice_candidates';
    const currentCandidates = (session[field] as any[]) || [];

    await supabase
      .from('sessions')
      .update({
        [field]: [...currentCandidates, candidate.toJSON()],
        updated_at: new Date().toISOString(),
      })
      .eq('id', session.id);
  }

  async startScreenShare() {
    if (!this.isSender || !this.pc) return;

    try {
      this.stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 },
        },
        audio: true,
      });

      this.stream.getTracks().forEach((track) => {
        this.pc?.addTrack(track, this.stream!);
      });

      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);

      const { data: session } = await supabase
        .from('sessions')
        .select('*')
        .eq('code', this.sessionCode)
        .maybeSingle();

      if (session) {
        await supabase
          .from('sessions')
          .update({
            offer: offer as any,
            status: 'connected',
            updated_at: new Date().toISOString(),
          })
          .eq('id', session.id);
      }

      this.stream.getVideoTracks()[0].onended = () => {
        this.cleanup();
      };

      return this.stream;
    } catch (error) {
      console.error('Error starting screen share:', error);
      throw error;
    }
  }

  onStream(callback: (stream: MediaStream) => void) {
    this.onStreamCallback = callback;
  }

  onConnectionState(callback: (state: string) => void) {
    this.onConnectionStateCallback = callback;
  }

  async cleanup() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.pc) {
      this.pc.close();
      this.pc = null;
    }

    if (this.realtimeChannel) {
      await supabase.removeChannel(this.realtimeChannel);
      this.realtimeChannel = null;
    }

    const { data: session } = await supabase
      .from('sessions')
      .select('*')
      .eq('code', this.sessionCode)
      .maybeSingle();

    if (session) {
      await supabase
        .from('sessions')
        .update({ status: 'closed', updated_at: new Date().toISOString() })
        .eq('id', session.id);
    }
  }
}
