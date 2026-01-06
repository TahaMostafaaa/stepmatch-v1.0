/**
 * Question Single Select Component
 * 
 * Renders a single-select question with radio button options
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Question, QuestionOption, UserResponse } from '../../types/onboarding';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

interface QuestionSingleSelectProps {
  question: Question;
  response?: UserResponse;
  onSelect: (optionId: string) => Promise<void>;
  disabled?: boolean;
}

const QuestionSingleSelect: React.FC<QuestionSingleSelectProps> = ({
  question,
  response,
  onSelect,
  disabled = false,
}) => {
  const theme = useTheme();
  const { colors }: { colors: any } = theme;
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    response?.option_id || null
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (response?.option_id) {
      setSelectedOptionId(response.option_id);
    }
  }, [response]);

  const handleSelect = async (optionId: string) => {
    if (disabled || isSaving || selectedOptionId === optionId) return;

    setSelectedOptionId(optionId);
    setIsSaving(true);

    try {
      await onSelect(optionId);
    } catch (error) {
      // Revert selection on error
      setSelectedOptionId(response?.option_id || null);
      console.error('Error saving selection:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Sort options by display_order
  const sortedOptions = [...question.options].sort(
    (a, b) => a.display_order - b.display_order
  );

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

      <View style={styles.optionsContainer}>
        {sortedOptions.map((option) => {
          const isSelected = selectedOptionId === option.id;
          const isDisabled = disabled || isSaving;

          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionItem,
                {
                  backgroundColor: theme.dark
                    ? 'rgba(255,255,255,.05)'
                    : COLORS.light,
                  borderColor: isSelected
                    ? COLORS.primary
                    : colors.borderColor,
                },
                isSelected && styles.optionItemSelected,
                isDisabled && styles.optionItemDisabled,
              ]}
              onPress={() => handleSelect(option.id)}
              disabled={isDisabled}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <View
                  style={[
                    styles.radioButton,
                    {
                      borderColor: isSelected
                        ? COLORS.primary
                        : colors.text,
                    },
                    isSelected && styles.radioButtonSelected,
                  ]}
                >
                  {isSelected && (
                    <View style={styles.radioButtonInner} />
                  )}
                </View>
                <Text
                  style={[
                    FONTS.font,
                    {
                      color: isSelected
                        ? colors.title
                        : colors.text,
                      flex: 1,
                    },
                  ]}
                >
                  {option.option_text}
                </Text>
                {isSaving && isSelected && (
                  <ActivityIndicator
                    size="small"
                    color={COLORS.primary}
                    style={styles.loadingIndicator}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

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
  optionsContainer: {
    gap: SIZES.margin / 2,
  },
  optionItem: {
    borderWidth: 2,
    borderRadius: SIZES.radius,
    padding: SIZES.padding,
    minHeight: 56,
  },
  optionItemSelected: {
    borderWidth: 2,
  },
  optionItemDisabled: {
    opacity: 0.6,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.margin,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderWidth: 2,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  loadingIndicator: {
    marginLeft: 'auto',
  },
});

export default QuestionSingleSelect;


