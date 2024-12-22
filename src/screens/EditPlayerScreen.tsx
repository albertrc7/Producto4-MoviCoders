import React, { useState, useEffect } from 'react';
import { View, Button, TextInput, Alert, Text, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
// Navigation
import { useNavigation, useRoute, type NavigationProp, RouteProp } from '@react-navigation/native';
import { type RootStackParams } from '../routes/StackNavigator';
// Styles
import { globalStyles } from '../styles/theme/global.styles';
import { FontAwesome6 } from '@expo/vector-icons';
// Models & Services
import { Player } from '../models/Player';
import { updatePlayer, getPlayerById } from '../services/playerService';

// Definición de los parámetros de la navegación
type EditPlayerScreenRouteProp = RouteProp<RootStackParams, 'Edit'>;

export const EditPlayerScreen: React.FC = () => {
  // Hook de navegación
  const navigation = useNavigation<NavigationProp<RootStackParams>>();
  // Hook de ruta
  const route = useRoute<EditPlayerScreenRouteProp>();
  // Parámetros de la ruta
  const { playerId } = route.params;

  // Estados
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [player, setPlayer] = useState<Player | null>(null);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [num, setNum] = useState('');
  const [age, setAge] = useState('');
  const [anillos, setAnillos] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<any>(null);
  const [videoFile, setVideoFile] = useState<any>(null);

  // Efecto para cargar el jugador
  useEffect(() => {
    const fetchPlayer = async () => {
      setLoading(true);
      try {
        const fetchedPlayer = await getPlayerById(playerId);
        setPlayer(fetchedPlayer);
        if (fetchedPlayer) {
          setName(fetchedPlayer.name);
          setPosition(fetchedPlayer.position);
          setNum(fetchedPlayer.num.toString());
          setAge(fetchedPlayer.age);
          setAnillos(fetchedPlayer.anillos);
          setDescription(fetchedPlayer.description);
        }
      } catch (error) {
        console.error('Error fetching player:', error);
        Alert.alert('Error fetching player');
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [playerId]);

  // Función de carga de imagen
  const handleChooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [5, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImageFile(result.assets[0].uri);
    }
  };

  // Función de carga de video
  const handleChooseVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setVideoFile(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!player) return;

    if (parseInt(age) < 18 || parseInt(age) > 64) {
      Alert.alert('La edad debe estar entre 18 y 64 años');
      return;
    }

    if (parseInt(num) < 0 || parseInt(num) > 99) {
      Alert.alert('El número debe estar entre 0 y 99');
      return;
    }

    setSaving(true);
    try {
      const updatedPlayer: Player = {
        ...player,
        name,
        position,
        num: parseInt(num),
        age,
        anillos,
        description,
        img: imageFile?.uri || player.img,
        video: videoFile?.uri || player.video,
      };
      await updatePlayer(player.id, updatedPlayer, imageFile, videoFile);
      Alert.alert('Jugador actualizado correctamente');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Detail', params: { player: updatedPlayer } }],
      });
    } catch (error) {
      console.error('Error al actualizar el jugador:', error);
      Alert.alert('Error al actualizar el jugador');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={globalStyles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!player) {
    return (
      <View style={globalStyles.centerContainer}>
        <Text style={globalStyles.title}>Jugador no encontrado</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <TextInput
        placeholder="Nombre"
        style={globalStyles.formInput}
        value={name}
        onChangeText={text => setName(text)}
      />
      <TextInput
        placeholder="Número"
        style={globalStyles.formInput}
        keyboardType="numeric"
        value={num}
        onChangeText={text => setNum(text)}
      />
      <TextInput
        placeholder="Edad"
        style={globalStyles.formInput}
        keyboardType="numeric"
        value={age}
        onChangeText={text => setAge(text)}
      />
      <TextInput
        placeholder="Anillos"
        style={globalStyles.formInput}
        keyboardType="numeric"
        value={anillos}
        onChangeText={text => setAnillos(text)}
      />
      <TextInput
        placeholder="Descripción"
        style={[globalStyles.formInput, { height: 100 }]} 
        value={description}
        multiline={true} 
        numberOfLines={4} 
        onChangeText={text => setDescription(text)}
      />
      <Picker
        selectedValue={position}
        style={globalStyles.pickerInput}
        onValueChange={(position) => setPosition(position)}
      >
        <Picker.Item label="Base" value="Base" />
        <Picker.Item label="Escolta" value="Escolta" />
        <Picker.Item label="Alero" value="Alero" />
        <Picker.Item label="Ala-Pivot" value="Ala-Pivot" />
        <Picker.Item label="Pivot" value="Pivot" />
      </Picker>
      <View style={globalStyles.buttonContainer}>
        <FontAwesome6.Button 
          name="image" 
          backgroundColor="#e65c00" 
          onPress={handleChooseImage}
        >
          Elige imagen
        </FontAwesome6.Button>
        <FontAwesome6.Button 
          name="video" 
          backgroundColor="#e65c00" 
          onPress={handleChooseVideo}
        >
          Elige video
        </FontAwesome6.Button>
      </View>
      <View style={globalStyles.formButtonSeparator} />
      {saving ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Guardar cambios" onPress={handleSubmit} />
      )}
    </View>
  );
};

export default EditPlayerScreen;