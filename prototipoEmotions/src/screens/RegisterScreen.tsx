import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { saveUser } from '@/storage/localDb';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { Spacing, BorderRadius } from '@/theme/spacing';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';
import BackgroundGradient from '@/components/BackgroundGradient';

type Question = { 
  id: string; 
  text: string; 
  options: Array<{ value: string; icon?: string; label: string }> 
};


const QUESTIONS: Question[] = [
  { 
    id: 'pet_preference', 
    text: '¿Qué prefieres?', 
    options: [
      { value: 'Cats', icon: 'pets', label: 'Gatos' },
      { value: 'Dogs', icon: 'pets', label: 'Perros' }
    ] 
  },
  { 
    id: 'app', 
    text: '¿Qué aplicación no puede faltar en tu teléfono?', 
    options: [
      { value: 'Instagram', icon: 'camera-alt', label: 'Instagram' },
      { value: 'Spotify', icon: 'music-note', label: 'Spotify' },
      { value: 'TikTok', icon: 'videogame-asset', label: 'TikTok' },
      { value: 'Snapchat', icon: 'chat', label: 'Snapchat' }
    ] 
  },
  { 
    id: 'day_off', 
    text: 'Si tuvieras un día libre y dinero ilimitado, ¿qué harías?', 
    options: [
      { value: 'Shopping', icon: 'shopping-bag', label: 'Ir de shopping y comprar todo lo que me gusta' },
      { value: 'Travel', icon: 'flight', label: 'Viajar a un lugar que nunca he visitado' },
      { value: 'Friends', icon: 'celebration', label: 'Pasar todo el día con mis amigos, haciendo algo épico' },
      { value: 'Home', icon: 'home', label: 'Pasar el día en casa viendo series y durmiendo' }
    ] 
  },
  { 
    id: 'friends_activity', 
    text: '¿Qué actividad prefieres hacer con tus amigos?', 
    options: [
      { value: 'Concert', icon: 'location-city', label: 'Ir a un concierto o festival de música' },
      { value: 'Movies', icon: 'movie', label: 'Maratón de películas o series en casa' },
      { value: 'Gaming', icon: 'sports-esports', label: 'Jugar videojuegos en línea con ellos' },
      { value: 'Creative', icon: 'palette', label: 'Pasar tiempo creativo haciendo proyectos juntos' }
    ] 
  },
  { 
    id: 'music_type', 
    text: '¿Cuál es tu tipo de música favorita?', 
    options: [
      { value: 'Pop/Electronic', icon: 'headphones', label: 'Pop o música electrónica, la que me hace bailar' },
      { value: 'Rock', icon: 'mic', label: 'Rock, me gusta la energía y los riffs de guitarra' },
      { value: 'HipHop', icon: 'music-note', label: 'Hip-hop o rap, me gusta la lírica y el ritmo' },
      { value: 'Indie', icon: 'spa', label: 'Indie, música relajada para desconectar' }
    ] 
  },
  { 
    id: 'famous_field', 
    text: 'Si fueras famoso/a, ¿en qué campo te gustaría destacar?', 
    options: [
      { value: 'Music', icon: 'mic', label: 'Música, me encantaría ser cantante o DJ' },
      { value: 'Acting', icon: 'movie', label: 'Actuar, ser una estrella de cine o televisión' },
      { value: 'Fashion', icon: 'camera-alt', label: 'Moda, ser un influencer y crear tendencias' },
      { value: 'Tech', icon: 'computer', label: 'Tecnología, ser un creador de contenido digital o programador/a' }
    ] 
  }
];

interface RegisterScreenProps {
  navigation: {
    replace: (screen: string) => void;
  };
}

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [birth, setBirth] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showModal, setShowModal] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const validateEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    
    if (!validateEmail(email)) newErrors.email = 'Correo inválido';
    if (!name) newErrors.name = 'Ingresa tu nombre';
    const age = Number(birth) || 0;
    if (age < 13) newErrors.birth = 'Debes tener al menos 13 años';
    if (password.length < 6) newErrors.password = 'Contraseña muy corta (mín. 6 caracteres)';
    if (!answers.pet_preference) newErrors.pet_preference = 'Selecciona tu preferencia de mascota';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const user = { email, name, age, password, personality: answers };
      await saveUser(user);
      // Guardar preferencia de mascota para decidir la pantalla de inicio
      // Se usa también en el decidor de la pestaña Inicio
      try {
        const { savePreferences } = await import('@/storage/localDb');
        await savePreferences({ petPreference: answers.pet_preference || 'Cats' });
      } catch (e) {
        // Ignorar errores silenciosamente; la app puede funcionar con el valor en user.personality
      }
      navigation.replace('MainTabs');
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear la cuenta. Inténtalo de nuevo.');
    }
  };

  const isTestComplete = Object.keys(answers).length === QUESTIONS.length;
  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === QUESTIONS.length - 1;

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
    
    if (isLastQuestion) {
      // Si es la última pregunta, mostrar el modal después de un pequeño delay
      setTimeout(() => {
        setShowModal(true);
      }, 500);
    } else {
      // Si no es la última pregunta, avanzar a la siguiente
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
      }, 300);
    }
  };

  const handleTestComplete = () => {
    if (isTestComplete) {
      setShowModal(true);
    }
  };

  return (
    <BackgroundGradient variant="primary">
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header con gradiente */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>¡Bienvenido!</Text>
        <Text style={styles.subtitleText}>Conoce más sobre ti en este divertido test</Text>
      </View>

      {/* Test de personalidad */}
      <Card variant="elevated" style={styles.testCard}>
        <View style={styles.testHeader}>
          <Text style={styles.sectionTitle}>Mini test de personalidad</Text>
          <Text style={styles.sectionSubtitle}>Ayúdanos a conocerte mejor</Text>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Pregunta {currentQuestionIndex + 1} de {QUESTIONS.length}
            </Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((currentQuestionIndex + 1) / QUESTIONS.length) * 100}%` }
                ]} 
              />
            </View>
          </View>
        </View>
        
        {!isTestComplete && currentQuestion && (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>
              {currentQuestionIndex + 1}. {currentQuestion.text}
            </Text>
            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option) => (
                <Button
                  key={option.value}
                  title={option.label}
                  icon={option.icon}
                  iconPosition="left"
                  onPress={() => handleAnswerSelect(currentQuestion.id, option.value)}
                  variant={answers[currentQuestion.id] === option.value ? 'primary' : 'outline'}
                  size="medium"
                  style={styles.optionButton}
                />
              ))}
            </View>
          </View>
        )}
        
        {isTestComplete && (
          <View style={styles.completionBadge}>
            <View style={styles.completionHeader}>
              <MaterialIcons name="celebration" size={32} color={Colors.emotions.happy} />
              <Text style={styles.completionText}>¡Test completado!</Text>
            </View>
            <Text style={styles.completionSubtext}>
              ¡Excelente! Ahora vamos a crear tu cuenta
            </Text>
          </View>
        )}
      </Card>

      {/* Modal de registro */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setShowModal(false)}
              style={styles.closeButton}
            >
              <MaterialIcons name="close" size={24} color={Colors.neutral[600]} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Completa tu registro</Text>
          </View>
          
          <ScrollView style={styles.modalContent} contentContainerStyle={styles.modalContentContainer}>
            <Card variant="elevated" style={styles.modalFormCard}>
              <View style={styles.sectionHeader}>
                <MaterialIcons name="edit" size={24} color={Colors.primary[600]} />
                <Text style={styles.sectionTitle}>Datos de registro</Text>
              </View>
              
              <Input
                label="Correo electrónico"
                placeholder="tu@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
                variant="filled"
              />
              
              <Input
                label="Nombre completo"
                placeholder="Tu nombre"
                value={name}
                onChangeText={setName}
                error={errors.name}
                variant="filled"
              />
              
              <Input
                label="Edad"
                placeholder="18"
                value={birth}
                onChangeText={setBirth}
                keyboardType="numeric"
                error={errors.birth}
                helperText="Debes tener al menos 13 años"
                variant="filled"
              />
              
              <Input
                label="Contraseña"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                error={errors.password}
                variant="filled"
              />
              
              <Button
                title="Crear mi cuenta"
                onPress={handleSubmit}
                size="large"
                style={styles.submitButton}
              />
            </Card>
          </ScrollView>
        </View>
      </Modal>
      </ScrollView>
    </BackgroundGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  welcomeText: {
    ...Typography.h1,
    textAlign: 'center',
    color: Colors.neutral[800], // Gris Oscuro - Texto principal
    marginBottom: Spacing.sm,
  },
  subtitleText: {
    ...Typography.playful,
    textAlign: 'center',
    color: Colors.neutral[600], // Gris Medio - Texto secundario
  },
  testCard: {
    marginBottom: Spacing.lg,
    ...Colors.Shadows.medium,
  },
  testHeader: {
    marginBottom: Spacing.lg,
  },
  progressContainer: {
    marginTop: Spacing.md,
  },
  progressText: {
    ...Typography.bodySmall,
    color: Colors.neutral[600],
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.neutral[200],
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary[500],
    borderRadius: 3,
  },
  formCard: {
    marginBottom: Spacing.lg,
    ...Colors.Shadows.medium,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.neutral[800], // Gris Oscuro - Texto principal
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    ...Typography.body,
    color: Colors.neutral[600], // Gris Medio - Texto secundario
    marginBottom: Spacing.lg,
  },
  questionContainer: {
    marginBottom: Spacing.lg,
  },
  questionText: {
    ...Typography.h4,
    color: Colors.neutral[800], // Gris Oscuro - Texto principal
    marginBottom: Spacing.md,
  },
  optionsContainer: {
    gap: Spacing.sm,
  },
  optionButton: {
    marginBottom: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  completionBadge: {
    backgroundColor: Colors.emotions.happy + '20',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.md,
    ...Colors.Shadows.small,
  },
  completionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  completionText: {
    ...Typography.playful,
    color: Colors.emotions.happy,
    fontWeight: '700',
  },
  completionSubtext: {
    ...Typography.body,
    color: Colors.neutral[600],
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  continueButton: {
    marginTop: Spacing.md,
  },
  submitButton: {
    marginTop: Spacing.md,
    ...Colors.Shadows.large,
  },
  // Estilos del modal
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background.light,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.background.light,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[200],
  },
  closeButton: {
    padding: Spacing.sm,
  },
  modalTitle: {
    ...Typography.h3,
    color: Colors.neutral[800],
    flex: 1,
    textAlign: 'center',
    marginRight: 40, // Compensar el botón de cerrar
  },
  modalContent: {
    flex: 1,
  },
  modalContentContainer: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  modalFormCard: {
    marginBottom: Spacing.lg,
    ...Colors.Shadows.medium,
  },
});


