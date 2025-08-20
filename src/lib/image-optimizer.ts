import sharp from 'sharp';

export interface ImageOptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'webp' | 'png';
}

export class ImageOptimizer {
  static async optimizeImage(
    imageBuffer: Buffer,
    options: ImageOptimizationOptions = {}
  ): Promise<Buffer> {
    const {
      maxWidth = 800,
      maxHeight = 800,
      quality = 80,
      format = 'jpeg'
    } = options;

    let pipeline = sharp(imageBuffer)
      .resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      });

    switch (format) {
      case 'jpeg':
        pipeline = pipeline.jpeg({ quality });
        break;
      case 'webp':
        pipeline = pipeline.webp({ quality });
        break;
      case 'png':
        pipeline = pipeline.png({ quality });
        break;
    }

    return await pipeline.toBuffer();
  }

  static async createThumbnail(
    imageBuffer: Buffer,
    size: number = 200
  ): Promise<Buffer> {
    return await sharp(imageBuffer)
      .resize(size, size, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 70 })
      .toBuffer();
  }

  static async getImageInfo(imageBuffer: Buffer): Promise<{
    width: number;
    height: number;
    size: number;
    format: string;
  }> {
    const metadata = await sharp(imageBuffer).metadata();
    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
      size: imageBuffer.length,
      format: metadata.format || 'unknown'
    };
  }

  static async optimizeForWeb(imageBuffer: Buffer): Promise<Buffer> {
    return await this.optimizeImage(imageBuffer, {
      maxWidth: 1200,
      maxHeight: 1200,
      quality: 85,
      format: 'webp'
    });
  }

  static async optimizeForThumbnail(imageBuffer: Buffer): Promise<Buffer> {
    return await this.optimizeImage(imageBuffer, {
      maxWidth: 300,
      maxHeight: 300,
      quality: 70,
      format: 'jpeg'
    });
  }
} 