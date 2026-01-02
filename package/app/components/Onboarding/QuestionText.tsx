/**
 * Question Text Component
 * 
 * Renders a text input question
 */

import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Question, UserResponse } from '../../types/onboarding';
import { COLORS, FONTS, SIZES } from '../../constants/theme';
import CustomInput from '../Input/CustomInput';

interface QuestionTextProps {
  question: Question;
  response?: UserResponse;
  onSave: (textValue: string) => Promise<void>;
  disabled?: boolean;
}

export interface QuestionTextRef {
  save: () => Promise<void>;
  getValue: () => string;
}

const QuestionText = forwardRef<QuestionTextRef, QuestionTextProps>(({
  question,
  response,
  onSave,
  disabled = false,
}, ref) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const [textValue, setTextValue] = useState<string>(
    response?.text_value || ''
  );
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (response?.text_value) {
      setTextValue(response.text_value);
      setHasChanged(false);
    }
  }, [response]);

  const handleTextChange = (text: string) => {
    setTextValue(text);
    setHasChanged(true);
  };

  const save = async () => {
    if (disabled || isSaving) return;
    
    // Always save if there's a value, even if hasn't changed flag isn't set
    // This ensures we save when force-saving before navigation
    const currentValue = textValue.trim();
    const savedValue = (response?.text_value || '').trim();
    
    if (!hasChanged && currentValue === savedValue) {
      // No changes and matches saved value
      return;
    }

    // Don't save empty strings for required questions
    if (question.is_required && currentValue.length === 0) {
      console.log('[QuestionText] Skipping save - required question has empty value');
      return;
    }

    setIsSaving(true);
    try {
      await onSave(textValue);
      setHasChanged(false);
      console.log('[QuestionText] Successfully saved text response');
    } catch (error) {
      console.error('Error saving text:', error);
      // Revert on error
      setTextValue(response?.text_value || '');
      setHasChanged(false);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const handleBlur = async () => {
    await save();
  };

  // Expose save method and getValue via ref
  useImperativeHandle(ref, () => ({
    save,
    getValue: () => textValue,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.questionHeader}>
        <Text
          style={[
            FONTS.h5,
            { color: theme.dark ? colors.title : COLORS.title },
            styles.questionText,
          ]}
        >
          {question.question_text}
        </Text>
        {question.is_required && (
          <Text style={[styles.requiredIndicator, { color: COLORS.danger }]}>
            *
          </Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <CustomInput
          placeholder="Enter your answer"
          value={textValue}
          onChangeText={handleTextChange}
          onBlur={handleBlur}
          multiline={question.question_text.length > 100}
          numberOfLines={question.question_text.length > 100 ? 4 : 1}
          editable={!disabled && !isSaving}
        />
        {isSaving && (
          <View style={styles.savingIndicator}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text
              style={[
                FONTS.fontSm,
                { color: colors.text, marginLeft: 8 },
              ]}
            >
              Saving...
            </Text>
          </View>
        )}
      </View>
    </View>
  );
});

QuestionText.displayName = 'QuestionText';

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.margin * 2,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.margin,
  },
  questionText: {
    flex: 1,
    marginRight: 4,
  },
  requiredIndicator: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 2,
  },
  inputContainer: {
    position: 'relative',
  },
  savingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingLeft: 4,
  },
});

export default QuestionText;

