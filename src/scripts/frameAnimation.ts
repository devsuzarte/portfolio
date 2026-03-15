// src/scripts/frameAnimation.ts
// Animação de frames baseada em scroll (canvas)
// Agente Consultado: ASSETS_AGENT

export interface FrameSequenceConfig {
  frameCount: number;           // Total de frames
  folder: string;               // Nome da pasta (dentro de /assets/frames/)
  prefix: string;               // Prefixo dos arquivos (ex: 'frame')
  extension: 'webp' | 'jpg';   // Formato das imagens
  scrollStart?: number;         // Offset de scroll para iniciar (px)
  scrollEnd?: number;           // Offset de scroll para terminar (px)
  onProgress?: (progress: number, frame: number) => void; // Callback de progresso
}

export class FrameSequence {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private frames: HTMLImageElement[] = [];
  private config: FrameSequenceConfig;
  private currentFrame: number = 0;
  private imagesLoaded: number = 0;
  private scrollHandler: () => void;
  private resizeHandler: () => void;
  private rafId: number | null = null;

  constructor(canvas: HTMLCanvasElement, config: FrameSequenceConfig) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.config = config;

    // Bind handlers para poder remover depois (cleanup)
    this.scrollHandler = this.handleScroll.bind(this);
    this.resizeHandler = this.handleResize.bind(this);

    this.setupCanvas();
    this.preloadFrames();
    this.initScrollListener();
  }

  private setupCanvas(): void {
    const setCanvasSize = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', this.resizeHandler);
  }

  private handleResize(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // Re-renderizar frame atual após resize
    this.renderFrame(this.currentFrame);
  }

  private preloadFrames(): void {
    const { frameCount, folder, prefix, extension } = this.config;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(4, '0'); // 0001, 0002, etc.

      img.src = `/assets/frames/${folder}/${prefix}_${frameNum}.${extension}`;

      img.onload = () => {
        this.imagesLoaded++;

        // Renderizar primeiro frame quando todas as imagens carregarem
        if (this.imagesLoaded === frameCount) {
          this.renderFrame(0);
        }
      };

      img.onerror = () => {
        console.warn(`[FrameSequence] Falha ao carregar frame: ${img.src}`);
        this.imagesLoaded++;
      };

      this.frames.push(img);
    }
  }

  private initScrollListener(): void {
    window.addEventListener('scroll', this.scrollHandler, { passive: true });
  }

  private handleScroll(): void {
    // Cancelar frame anterior se ainda não foi processado
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }

    this.rafId = requestAnimationFrame(() => {
      const {
        scrollStart = 0,
        scrollEnd = document.body.scrollHeight - window.innerHeight,
        onProgress,
      } = this.config;

      const scrollTop = window.scrollY;
      const scrollRange = scrollEnd - scrollStart;
      const scrollProgress = Math.max(
        0,
        Math.min(1, (scrollTop - scrollStart) / scrollRange)
      );

      const frameIndex = Math.floor(
        scrollProgress * (this.frames.length - 1)
      );

      if (frameIndex !== this.currentFrame) {
        this.currentFrame = frameIndex;
        this.renderFrame(frameIndex);
      }

      onProgress?.(scrollProgress, frameIndex);
      this.rafId = null;
    });
  }

  private renderFrame(index: number): void {
    const img = this.frames[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const { canvas, ctx } = this;

    // Cover: preenche o canvas mantendo aspect ratio
    const scale = Math.max(
      canvas.width / img.naturalWidth,
      canvas.height / img.naturalHeight
    );

    const x = (canvas.width - img.naturalWidth * scale) / 2;
    const y = (canvas.height - img.naturalHeight * scale) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img,
      x,
      y,
      img.naturalWidth * scale,
      img.naturalHeight * scale
    );
  }

  /** Retorna quantos frames já foram carregados (0 a 1) */
  get loadProgress(): number {
    return this.imagesLoaded / this.config.frameCount;
  }

  /** Navega diretamente para um frame específico */
  public goToFrame(index: number): void {
    const clamped = Math.max(0, Math.min(this.frames.length - 1, index));
    this.currentFrame = clamped;
    this.renderFrame(clamped);
  }

  /** Cleanup - remover listeners e liberar memória */
  public dispose(): void {
    window.removeEventListener('scroll', this.scrollHandler);
    window.removeEventListener('resize', this.resizeHandler);

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }

    // Limpar referências das imagens
    this.frames = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
