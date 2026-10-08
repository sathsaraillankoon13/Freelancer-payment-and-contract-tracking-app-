import { MotionModal as Modal } from '@/components/ui/Motion';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useAppContext } from '@/context/AppContext';
import { ClientsScreen } from '@/features/clients/screens/ClientsScreen';

export const ClientsDirectoryModal: React.FC = () => {
  const { activeModal, closeModal } = useAppContext();
  const isVisible = activeModal === 'clients_directory';

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={closeModal}
    >
      <View style={styles.container}>
        <ClientsScreen onBack={closeModal} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
