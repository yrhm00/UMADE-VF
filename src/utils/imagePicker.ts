import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

export interface PickedImage {
  uri: string;
  mimeType: string;
  fileName?: string;
  width?: number;
  height?: number;
}

export interface CompressionOptions {
  /**
   * Compression quality between 0 and 1.
   */
  quality?: number;
  /**
   * Maximum width in pixels. Preserves ratio.
   */
  maxWidth?: number;
  /**
   * Maximum height in pixels. Preserves ratio.
   */
  maxHeight?: number;
}

async function requestPermissions() {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission to access media library was denied');
  }
}

export async function pickImage(): Promise<PickedImage | null> {
  await requestPermissions();

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false,
    quality: 1,
  });

  if (result.canceled) {
    return null;
  }

  const asset = result.assets[0];
  return {
    uri: asset.uri,
    mimeType: asset.mimeType ?? 'image/jpeg',
    fileName: asset.fileName,
    width: asset.width,
    height: asset.height,
  };
}

export async function takePhoto(): Promise<PickedImage | null> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission to access camera was denied');
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false,
    quality: 1,
  });

  if (result.canceled) {
    return null;
  }

  const asset = result.assets[0];
  return {
    uri: asset.uri,
    mimeType: asset.mimeType ?? 'image/jpeg',
    fileName: asset.fileName,
    width: asset.width,
    height: asset.height,
  };
}

export async function compressImage(
  image: PickedImage,
  options: CompressionOptions,
): Promise<PickedImage> {
  const actions: ImageManipulator.Action[] = [];

  if (options.maxWidth || options.maxHeight) {
    actions.push({
      resize: {
        width: options.maxWidth,
        height: options.maxHeight,
      },
    });
  }

  const { uri, width, height } = await ImageManipulator.manipulateAsync(
    image.uri,
    actions,
    { compress: options.quality ?? 0.8, format: ImageManipulator.SaveFormat.JPEG },
  );

  return {
    ...image,
    uri,
    mimeType: 'image/jpeg',
    width,
    height,
  };
}
