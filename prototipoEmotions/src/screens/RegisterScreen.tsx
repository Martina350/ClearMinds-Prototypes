import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, StyleSheet } from 'react-native';
import { saveUser } from '@/storage/localDb';
import { Colors } from '@/theme/colors';
import { Typography } from '@/theme/typography';
import { Spacing, BorderRadius } from '@/theme/spacing';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Card from '@/components/Card';

type Question = { 
  id: string; 
  text: string; 
  options: Array<{ value: string; emoji?: string; label: string }> 
};

const QUESTIONS: Question[] = [
  { 
    id: 'music', 
    text: '¿Qué tipo de música prefieres? 🎵', 
    options: [
      { value: 'Pop', emoji: '🎤', label: 'Pop' },
      { value: 'Rock', emoji: '🎸', label: 'Rock' },
      { value: 'Clásica', emoji: '🎼', label: 'Clásica' },
      { value: 'Electrónica', emoji: '🎧', label: 'Electrónica' },
      { value: 'Latina', emoji: '🥁', label: 'Latina' }
    ] 
  },
  { 
    id: 'activity', 
    text: '¿Cuál es tu actividad favorita? 🎯', 
    options: [
      { value: 'Leer', emoji: '📚', label: 'Leer' },
      { value: 'Deporte', emoji: '⚽', label: 'Deporte' },
      { value: 'Videojuegos', emoji: '🎮', label: 'Videojuegos' },
      { value: 'Cocinar', emoji: '👨‍🍳', label: 'Cocinar' },
      { value: 'Pasear', emoji: '🚶‍♀️', label: 'Pasear' }
    ] 
  },
  { 
    id: 'animal', 
    text: '¿Cuál es tu animal favorito? 🐾', 
    options: [
      { value: '🦁', emoji: '🦁', label: 'León' },
      { value: '🐍', emoji: '🐍', label: 'Serpiente' },
      { value: '🦋', emoji: '🦋', label: 'Mariposa' },
      { value: '🐶', emoji: '🐶', label: 'Perro' },
      { value: '🐱', emoji: '🐱', label: 'Gato' }
    ] 
  },
  { 
    id: 'moment', 
    text: '¿Qué momento del día prefieres? ⏰', 
    options: [
      { value: 'Mañana', emoji: '🌅', label: 'Mañana' },
      { value: 'Tarde', emoji: '☀️', label: 'Tarde' },
      { value: 'Noche', emoji: '🌙', label: 'Noche' }
    ] 
  },
  { 
    id: 'social', 
    text: '¿Te consideras más... 🤔', 
    options: [
      { value: 'Introvertido/a', emoji: '🏠', label: 'Introvertido/a' },
      { value: 'Extrovertido/a', emoji: '🎉', label: 'Extrovertido/a' },
      { value: 'Ambivertido/a', emoji: '⚖️', label: 'Ambivertido/a' }
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

  const validateEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {};
    
    if (!validateEmail(email)) newErrors.email = 'Correo inválido';
    if (!name) newErrors.name = 'Ingresa tu nombre';
    const age = Number(birth) || 0;
    if (age < 13) newErrors.birth = 'Debes tener al menos 13 años';
    if (password.length < 6) newErrors.password = 'Contraseña muy corta (mín. 6 caracteres)';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const user = { email, name, age, password, personality: answers };
      await saveUser(user);
      navigation.replace('MainTabs');
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear la cuenta. Inténtalo de nuevo.');
    }
  };

  const isTestComplete = Object.keys(answers).length === QUESTIONS.length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header con gradiente */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>¡Bienvenido a ClearMinds! 🧠✨</Text>
        <Text style={styles.subtitleText}>Conoce más sobre ti en este divertido test</Text>
      </View>

      {/* Test de personalidad */}
      <Card variant="elevated" style={styles.testCard}>
        <Text style={styles.sectionTitle}>Mini test de personalidad 🎨</Text>
        <Text style={styles.sectionSubtitle}>Ayúdanos a conocerte mejor</Text>
        
        {QUESTIONS.map((question, questionIndex) => (
          <View key={question.id} style={styles.questionContainer}>
            <Text style={styles.questionText}>
              {questionIndex + 1}. {question.text}
            </Text>
            <View style={styles.optionsContainer}>
              {question.options.map((option) => (
                <Button
                  key={option.value}
                  title={`${option.emoji} ${option.label}`}
                  onPress={() => {
                    setAnswers(prev => ({ ...prev, [question.id]: option.value }));
                    setErrors({}); // Limpiar errores al interactuar
                  }}
                  variant={answers[question.id] === option.value ? 'primary' : 'outline'}
                  size="small"
                  style={styles.optionButton}
                />
              ))}
            </View>
          </View>
        ))}
        
        {isTestComplete && (
          <View style={styles.completionBadge}>
            <Text style={styles.completionText}>🎉 ¡Test completado! 🎉</Text>
          </View>
        )}
      </Card>

      {/* Formulario de registro */}
      <Card variant="elevated" style={styles.formCard}>
        <Text style={styles.sectionTitle}>Datos de registro 📝</Text>
        
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
          title="🚀 Crear mi cuenta"
          onPress={handleSubmit}
          size="large"
          style={styles.submitButton}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.light,
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
    color: Colors.primary[700],
    marginBottom: Spacing.sm,
  },
  subtitleText: {
    ...Typography.playful,
    textAlign: 'center',
    color: Colors.neutral[600],
  },
  testCard: {
    marginBottom: Spacing.lg,
  },
  formCard: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.primary[700],
    marginBottom: Spacing.xs,
  },
  sectionSubtitle: {
    ...Typography.body,
    color: Colors.neutral[600],
    marginBottom: Spacing.lg,
  },
  questionContainer: {
    marginBottom: Spacing.lg,
  },
  questionText: {
    ...Typography.h4,
    color: Colors.neutral[800],
    marginBottom: Spacing.md,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  optionButton: {
    flex: 1,
    minWidth: '45%',
    marginBottom: Spacing.sm,
  },
  completionBadge: {
    backgroundColor: Colors.emotions.happy + '20',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  completionText: {
    ...Typography.playful,
    color: Colors.emotions.happy,
    fontWeight: '700',
  },
  submitButton: {
    marginTop: Spacing.md,
    ...Colors.Shadows.large,
  },
});


