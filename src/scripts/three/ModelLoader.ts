// src/scripts/three/ModelLoader.ts
// Loader de modelos GLB/GLTF com suporte a Draco compression
// Agente Consultado: ASSETS_AGENT

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

interface ModelLoaderOptions {
  dracoDecoderPath?: string;  // Caminho para os decoders Draco
  onProgress?: (percent: number) => void; // Callback de progresso
}

export class ModelLoader {
  private loader: GLTFLoader;
  private dracoLoader: DRACOLoader;

  constructor(options: ModelLoaderOptions = {}) {
    const { dracoDecoderPath = '/draco/', onProgress } = options;

    this.loader = new GLTFLoader();

    // Draco loader para modelos comprimidos (reduz tamanho ~80%)
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath(dracoDecoderPath);
    this.loader.setDRACOLoader(this.dracoLoader);
  }

  /**
   * Carrega um modelo GLB/GLTF
   * @param url - Caminho do modelo (ex: '/assets/models/laptop.glb')
   * @param onProgress - Callback de progresso (0-100)
   */
  async load(
    url: string,
    onProgress?: (percent: number) => void
  ): Promise<THREE.Group> {
    return new Promise((resolve, reject) => {
      this.loader.load(
        url,
        (gltf) => {
          resolve(gltf.scene);
        },
        (event) => {
          if (event.total > 0) {
            const percent = (event.loaded / event.total) * 100;
            onProgress?.(Math.round(percent));
          }
        },
        (error) => {
          console.error(`[ModelLoader] Erro ao carregar: ${url}`, error);
          reject(error);
        }
      );
    });
  }

  /**
   * Pré-carrega múltiplos modelos em paralelo
   */
  async preloadAll(
    urls: string[]
  ): Promise<Map<string, THREE.Group>> {
    const results = new Map<string, THREE.Group>();

    await Promise.allSettled(
      urls.map(async (url) => {
        try {
          const model = await this.load(url);
          results.set(url, model);
        } catch (error) {
          console.warn(`[ModelLoader] Falha ao pré-carregar: ${url}`);
        }
      })
    );

    return results;
  }

  /** Libera os decoders Draco da memória */
  dispose(): void {
    this.dracoLoader.dispose();
  }
}

/**
 * Helper para fazer dispose completo de um modelo Three.js
 */
export const disposeModel = (model: THREE.Group): void => {
  model.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;

    object.geometry.dispose();

    if (Array.isArray(object.material)) {
      object.material.forEach((m) => {
        disposeMaterial(m);
      });
    } else {
      disposeMaterial(object.material);
    }
  });
};

const disposeMaterial = (material: THREE.Material): void => {
  // Dispose de texturas
  Object.values(material).forEach((value) => {
    if (value instanceof THREE.Texture) {
      value.dispose();
    }
  });

  material.dispose();
};
