import { Platform, Linking } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Directory, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import type { FileAttachment } from '@/types';
export async function pickAttachment(type: string | string[] = '*/*'): Promise<FileAttachment | null> {
  const result = await DocumentPicker.getDocumentAsync({ type, copyToCacheDirectory: true, multiple: false });
  if (result.canceled) return null;
  const asset = result.assets[0];
  if ((asset.size || 0) > 20 * 1024 * 1024) throw new Error('Please choose a file smaller than 20 MB.');
  if (Platform.OS === 'web') throw new Error('Persistent file attachments are available in the mobile app.');
  const directory = new Directory(Paths.document, 'attachments');
  directory.create({ intermediates: true, idempotent: true });
  const safeName = asset.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const destination = new File(directory, `${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${safeName}`);
  new File(asset.uri).copy(destination);
  return { uri: destination.uri, name: asset.name, size: asset.size || destination.size, mimeType: asset.mimeType || 'application/octet-stream' };
}
export async function openAttachment(attachment?: FileAttachment) {
  if (!attachment) throw new Error('This older record has no attached file. Please ask the sender to attach it again.');
  if (Platform.OS === 'web') { await Linking.openURL(attachment.uri); return; }
  if (!new File(attachment.uri).exists) throw new Error('This file is not available on this device.');
  if (!await Sharing.isAvailableAsync()) throw new Error('File sharing is unavailable on this device.');
  await Sharing.shareAsync(attachment.uri, { mimeType: attachment.mimeType, dialogTitle: attachment.name });
}
