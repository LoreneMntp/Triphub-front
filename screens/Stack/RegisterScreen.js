/**
 * Composant RegisterScreen
 * 
 * Ce composant représente l'écran d'inscription où les utilisateurs peuvent créer un nouveau compte.
 * Il inclut des champs de saisie pour le nom d'utilisateur, l'e-mail, le mot de passe et la confirmation du mot de passe.
 * Les utilisateurs peuvent s'inscrire en fournissant les informations requises et en appuyant sur le bouton "S'inscrire".
 * De plus, les utilisateurs peuvent choisir de continuer avec l'authentification Google ou Facebook.
 * En cas d'erreurs lors de l'inscription, une modal d'alerte sera affichée avec des messages pertinents.
 */

import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Chrome, Facebook } from 'lucide-react-native';
import {login} from "../../reducers/users"; // Import du composant Facebook et Google et Flèche de droite
import { useDispatch} from "react-redux";

const RegisterScreen = () => {
  // Variables d'état pour stocker la saisie utilisateur et gérer la visibilité de la modal d'alerte
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const dispatch = useDispatch();
  // Hook de navigation pour gérer les actions de navigation
  const navigation = useNavigation();

  // Fonction pour gérer la navigation arrière
  const handlePress = () => {
    navigation.goBack();
  };

  // Fonction pour gérer l'inscription de l'utilisateur
  const handleRegister = () => {
    // Vérifier si tous les champs requis sont remplis
    if (!username || !email || !password || !confirmPassword) {
      setAlertMessage('Veuillez remplir tous les champs');
      setAlertVisible(true);
      return;
    }

    // Vérifier si les mots de passe correspondent
    if (password !== confirmPassword) {
      setAlertMessage('Les mots de passe ne correspondent pas');
      setAlertVisible(true);
      return;
    }

    // Vérifier si l'e-mail est valide
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAlertMessage('Veuillez saisir une adresse e-mail valide');
      setAlertVisible(true);
      return;
    }

    // Préparer les données utilisateur pour les envoyer au serveur
    const userData = {
      username: username,
      email: email,
      password: password,
    };

    // Envoyer les données au backend via une requête fetch
    const url = `${process.env.EXPO_PUBLIC_BACKEND_URL}/users/register`;
    console.log(url)
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
    .then(response => response.json())
    .then(data => {
      // Gérer la réponse du serveur
      if (data.result) {
        // Réinitialiser les champs après une inscription réussie
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setAlertMessage('Inscription réussie!');
        setAlertVisible(true);
        // Naviguer vers la HomePage après une inscription réussie
        dispatch(
            login({
              email: data.user.email,
              token: data.user.token,
              name: data.user.username,
            })
        );
        navigation.navigate('Home');
      } else {
        // Gérer les erreurs d'inscription côté client
        if (data.error === "Email already exists.") {
          setAlertMessage('Cet email existe déjà.');
        } else if (data.error === "Username already exists.") {
          setAlertMessage('Ce nom d\'utilisateur existe déjà.');
        } else {
          setAlertMessage('Une erreur s\'est produite lors de l\'inscription');
        }
        setAlertVisible(true);
      }
    })
    .catch(error => {
      // Gérer les erreurs de requête
      console.error('Erreur lors de la requête :', error);
      setAlertMessage('Une erreur s\'est produite lors de l\'inscription');
      setAlertVisible(true);
    });
  };

  return (
    <View style={styles.container}>
      {/* Bouton de navigation arrière */}
      <Pressable style={{ paddingTop: 10 }} onPress={handlePress}>
        <ChevronLeft style={styles.arrow} />
      </Pressable>
      {/* Titre de la page */}
      <Text style={styles.page}>S'inscrire</Text>
      {/* Champs de saisie pour le nom d'utilisateur, l'e-mail, le mot de passe et la confirmation du mot de passe */}
      <TextInput
        onChangeText={setUsername}
        value={username}
        placeholder="Nom d'utilisateur"
        style={styles.input}
      />
      <TextInput
        onChangeText={setEmail}
        value={email}
        placeholder="E-mail"
        style={styles.input}
      />
      <TextInput
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}
        placeholder="Mot de passe"
        style={styles.input}
      />
      <TextInput
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        secureTextEntry={true}
        placeholder="Confirmer le mot de passe"
        style={styles.input}
      />
      {/* Bouton d'inscription */}
      <Pressable style={styles.button_register} onPress={handleRegister}>
        <Text style={styles.buttonText}>S'inscrire</Text>
      </Pressable>
      {/* Séparateur OU */}
      <Text style={styles.or}>OU</Text>
      {/* Bouton d'authentification Google */}
      <Pressable style={styles.google}>
        <Chrome style={styles.googleIcon} />
        <Text style={styles.google_text}>Continuer avec Google</Text>
      </Pressable>
      {/* Bouton d'authentification Facebook */}
      <Pressable style={styles.facebook}>
        <Facebook style={styles.facebookIcon} />
        <Text style={styles.facebook_text}>Continuer avec Facebook</Text>
      </Pressable>
      {/* Modal d'alerte pour afficher les messages d'inscription */}
      <Modal isVisible={isAlertVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{alertMessage}</Text>
          <Pressable style={styles.modalButton} onPress={() => setAlertVisible(false)}>
            <Text style={styles.buttonText}>OK</Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

// Styles pour le composant RegisterScreen
const styles = StyleSheet.create({
  container: {
    padding: 40,
  },
  arrow:{
    color: 'black',
  },
  page: {
    textAlign: 'center',
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button_register: {
    marginTop: 20,
    backgroundColor: '#F2A65A',
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  or: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 40,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    color: 'black',
    marginBottom: 10,
  },
  modalButton: {
    marginTop: 20,
    backgroundColor: '#F2A65A',
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
  },
  google: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    marginTop: 20,
    borderColor: 'gray', 
    borderWidth: 1, 
  },
  googleIcon: {
    marginRight: 10,
    color: '#F2A65A',
  },
  google_text: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  facebook: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    marginTop: 20,
    borderColor: 'gray', 
    borderWidth: 1, 
  },
  facebookIcon: {
    marginRight: 10,
    color: '#1877F2',
  },
  facebook_text: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
