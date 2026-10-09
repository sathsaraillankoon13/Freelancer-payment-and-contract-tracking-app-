import { Platform, Linking } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Directory, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as WebBrowser from 'expo-web-browser';
import type { FileAttachment } from '@/types';

export async function pickImage(): Promise<FileAttachment | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Photo library permission is required to select images.');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    quality: 0.85,
  });

  if (result.canceled || !result.assets || result.assets.length === 0) {
    return null;
  }

  const asset = result.assets[0];
  const rawName = asset.fileName || `image_${Date.now()}.jpg`;
  const safeName = rawName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const mimeType = asset.mimeType || 'image/jpeg';
  const size = asset.fileSize || 0;

  if (Platform.OS === 'web') {
    return { uri: asset.uri, name: safeName, size, mimeType };
  }

  try {
    const directory = new Directory(Paths.document, 'attachments');
    directory.create({ intermediates: true, idempotent: true });
    const destination = new File(
      directory,
      `${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${safeName}`
    );
    new File(asset.uri).copy(destination);
    return {
      uri: destination.uri,
      name: safeName,
      size: destination.size || size,
      mimeType,
    };
  } catch {
    // If copying fails (e.g. content URI or security sandbox), use cached uri directly
    return {
      uri: asset.uri,
      name: safeName,
      size,
      mimeType,
    };
  }
}

export async function pickAttachment(type: string | string[] = '*/*'): Promise<FileAttachment | null> {
  const result = await DocumentPicker.getDocumentAsync({ type, copyToCacheDirectory: true, multiple: false });
  if (result.canceled || !result.assets || result.assets.length === 0) return null;
  const asset = result.assets[0];
  if ((asset.size || 0) > 20 * 1024 * 1024) throw new Error('Please choose a file smaller than 20 MB.');
  if (Platform.OS === 'web') return { uri: asset.uri, name: asset.name, size: asset.size, mimeType: asset.mimeType || 'application/octet-stream' };
  
  const safeName = (asset.name || `file_${Date.now()}`).replace(/[^a-zA-Z0-9._-]/g, '_');

  try {
    const directory = new Directory(Paths.document, 'attachments');
    directory.create({ intermediates: true, idempotent: true });
    const destination = new File(directory, `${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${safeName}`);
    new File(asset.uri).copy(destination);
    return {
      uri: destination.uri,
      name: asset.name,
      size: asset.size || destination.size,
      mimeType: asset.mimeType || 'application/octet-stream',
    };
  } catch {
    // Fallback to cache URI directly if new File(uri).copy fails on Android SAF content URI
    return {
      uri: asset.uri,
      name: asset.name,
      size: asset.size || 0,
      mimeType: asset.mimeType || 'application/octet-stream',
    };
  }
}

export async function openAttachment(attachment?: FileAttachment | string | null) {
  const uri = typeof attachment === 'string' ? attachment : attachment?.uri;
  const name = typeof attachment === 'string' ? 'Attachment' : attachment?.name || 'Attachment';
  const mimeType = typeof attachment === 'string' ? undefined : attachment?.mimeType;

  if (!uri) {
    throw new Error('This record has no attached file.');
  }

  // Handle remote HTTP / HTTPS URLs (e.g. Firebase Storage, Google Drive, web assets)
  if (uri.startsWith('http://') || uri.startsWith('https://')) {
    try {
      await WebBrowser.openBrowserAsync(uri);
      return;
    } catch {
      try {
        await Linking.openURL(uri);
        return;
      } catch {
        throw new Error('Unable to open URL in browser.');
      }
    }
  }

  if (Platform.OS === 'web') {
    await Linking.openURL(uri);
    return;
  }

  // Local file URI on native devices
  try {
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(uri, {
        mimeType: mimeType,
        dialogTitle: name,
      });
      return;
    }
  } catch (shareErr) {
    console.warn('[openAttachment] Sharing notice, attempting Linking fallback:', shareErr);
  }

  try {
    await Linking.openURL(uri);
  } catch {
    throw new Error('Could not open file on this device.');
  }
}
